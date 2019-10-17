import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrdersService } from './order.service';
import { RequestItemModule } from '../request-item';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        RequestItemModule,
    ],
    exports: [OrdersService],
    providers: [
        OrdersService,
    ],
})
export class OrderModule {
}
