import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestItem } from './request-item.entity';
import { RequestItemsService } from './request-item.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([RequestItem]),
    ],
    exports: [RequestItemsService],
    providers: [
        RequestItemsService,
    ],
})
export class RequestItemModule {
}
