import {NestFactory} from '@nestjs/core';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import fastifyHelmet from 'fastify-helmet/index';
import {WsAdapter} from '@nestjs/platform-ws';
import {RmqOptions, Transport} from '@nestjs/microservices';
import {ConfigService} from '@nestjs/config';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import compression from 'fastify-compress';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            logger: process.env.NODE_ENV === 'development',
        }),
    );

    const config = app.get(ConfigService);

    app.enableCors(config.get('config'));
    void app.register(fastifyHelmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ['\'self\''],
                styleSrc: ['\'self\'', '\'unsafe-inline\''],
                imgSrc: ['\'self\'', 'data:', 'validator.swagger.io'],
                scriptSrc: ['\'self\'', 'https: \'unsafe-inline\''],
            },
        },
    });

    if (process.env.AGGREGATOR_ENABLED === 'true') {
        app.connectMicroservice<RmqOptions>({
            transport: Transport.RMQ,
            options: {
                urls: config.get('rabbitmq.url'),
                queue: config.get('rabbitmq.queue'),
                queueOptions: {
                    durable: true,
                    messageTtl: 10800000, // 3 hours
                    arguments: {
                        'x-queue-mode': 'lazy',
                    },
                },
                noAck: false,
                prefetchCount: process.env.RABBITMQ_PREFETCH ? parseInt(process.env.RABBITMQ_PREFETCH, 10) : 2000,
            },
        });

        app.useWebSocketAdapter(new WsAdapter(app));
    }

    const options = new DocumentBuilder()
        .setTitle('PS2Alerts API')
        .setDescription('PS2Alerts API. Please visit our <a href="https://github.com/ps2alerts/api">GitHub project</a> for more information or to support the project. <br><br>There are the following limits applied to this API: <br><ol><li>You are limited to taking 1000 maximum documents from any */global/* endpoint, you must then paginate thereafter. */instance/* endpoints don\'t have such limitations.</li><li>There are <b>currently</b> no rate limits, however requests are being monitored and any abuse will result in rate limit implementation.</li></ol>')
        .setVersion('3.0-alpha')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/', app, document);

    // Connects to Rabbit etc
    await app.startAllMicroservicesAsync();

    void app.register(compression, {encodings: ['gzip', 'deflate']});

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const port = config.get('http.port') ?? 3000;
    await app.listen(port, '0.0.0.0');
    // eslint-disable-next-line no-console
    console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
