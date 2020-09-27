import {NestFactory} from '@nestjs/core';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import fastifyHelmet from 'fastify-helmet/index';
import {WsAdapter} from '@nestjs/platform-ws';
import {RmqOptions, Transport} from '@nestjs/microservices';
import {ConfigService} from '@nestjs/config';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {WINSTON_MODULE_NEST_PROVIDER, WinstonModule} from 'nest-winston';
import {get} from './utilities/env';
import {config} from 'winston';
import {ConsoleTransportInstance} from 'winston/lib/winston/transports';

async function bootstrap(): Promise<void> {
    const consoleTransport = {
        name: 'console',
        level: get('LOG_LEVEL', get('NODE_ENV', 'development') === 'development' ? 'debug' : 'info'),

    };

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            logger: true,
        }),
        {
            logger: WinstonModule.createLogger({
                levels: config.npm.levels,
                level: get('LOG_LEVEL', get('NODE_ENV', 'development') === 'development' ? 'debug' : 'info'),
                transports: [consoleTransport],
            }),
        },
    );

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    const appConfig = app.get(ConfigService);

    app.enableCors(appConfig.get('config'));
    app.register(fastifyHelmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ['\'self\''],
                styleSrc: ['\'self\'', '\'unsafe-inline\''],
                imgSrc: ['\'self\'', 'data:', 'validator.swagger.io'],
                scriptSrc: ['\'self\'', 'https: \'unsafe-inline\''],
            },
        },
    });

    app.connectMicroservice<RmqOptions>({
        transport: Transport.RMQ,
        options: {
            urls: appConfig.get('rabbitmq.url'),
            queue: appConfig.get('rabbitmq.queue'),
            queueOptions: {
                durable: true,
            },
        },
    });

    app.useWebSocketAdapter(new WsAdapter(app));

    const options = new DocumentBuilder()
        .setTitle('PS2Alerts API')
        .setDescription('PS2Alerts API documentation')
        .setVersion('3.0-alpha')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/', app, document);

    // await app.startAllMicroservicesAsync();
    const port = appConfig.get('http.port') ?? 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
