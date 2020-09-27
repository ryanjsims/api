import {Module} from '@nestjs/common';
import ConfigModule from './config/config.module';
import {DefaultController} from './controllers/default.controller';
import {RestModule} from './modules/rest/rest.module';
import {AggregatorModule} from './modules/aggregator/aggregator.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MongoConfig} from './services/databases/mongo.config';
import {config} from 'winston';
import {get} from './utilities/env';

@Module({
    imports: [
        ConfigModule, // Must come first
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: MongoConfig,
        }),
        AggregatorModule,
        RestModule,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    ],
    controllers: [DefaultController],
    providers: [],
})
export class AppModule {}
