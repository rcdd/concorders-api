import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '../config';
import { AuthModule } from '../auth';
import { TableModule } from '../table';
import { PlaceModule } from '../place';
import { OrderModule } from '../order';
import { MenuModule } from '../menu';
import { RequestItemModule } from '../request-item';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    type: configService.get('DB_TYPE'),
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [__dirname + './../**/**.entity{.ts,.js}'],
                    synchronize: configService.isEnv('dev'),
                } as TypeOrmModuleAsyncOptions;
            },
        }),
        ConfigModule,
        AuthModule,
        TableModule,
        PlaceModule,
        OrderModule,
        MenuModule,
        RequestItemModule,
    ],
    controllers: [
        AppController,
    ],
    providers: [
        AppService,
    ],
})

export class AppModule {
}
