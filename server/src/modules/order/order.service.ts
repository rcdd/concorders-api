import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order, OrderFillableFields } from './order.entity';
import { RequestItem, RequestItemFillableFields, RequestItemsService } from '../request-item';

@Injectable()
export class OrdersService {

    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly requestItemService: RequestItemsService,
    ) {
    }

    async get(id: number) {
        return this.orderRepository.findOne(id, {relations: ['request']});
    }

    async sumTotal(order: OrderFillableFields): Promise<number> {
        let total = 0;

        order.request.forEach(item => {
            total += item.price * item.amount;
        });
        return total;
    }

    async getActiveOrder(placeId: number) {
        return await this.orderRepository.createQueryBuilder('order')
            .innerJoinAndSelect('order.request', 'request')
            .where('order.place = :placeId')
            .andWhere('order.isClosed = false')
            .setParameter('placeId', placeId)
            .getOne();
    }

    async updateOrder(orderId: number, requests: RequestItemFillableFields[]) {
        const order = await this.get(orderId);

        if (!order) {
            throw new NotAcceptableException(
                'Order not found.',
            );
        }

        if (order.isClosed) {
            throw new NotAcceptableException(
                'Order already closed.',
            );
        }

        await order.request.forEach(async item => {
            if (!requests.some(_item => _item.name === item.name)) {
                await this.requestItemService.delete(item.id);
                const index = await order.request.findIndex(r => r.id === item.id);
                order.request.splice(index, 1);
                order.total = await this.sumTotal(order);
                await this.orderRepository.update(order.id, {total: order.total});
            }
        });

        await requests.forEach(req => {
            const elm = order.request.find(e => e.name === req.name);
            if (elm) {
                elm.amount = req.amount;
            } else {
                const newItem = new RequestItem();
                Object.assign(newItem, req);
                order.request.push(newItem);
            }
        });

        order.total = await this.sumTotal(order);

        return await this.orderRepository.save(order);
    }

    async closeOrder(id: number) {
        const order = await this.get(id);

        if (!order) {
            throw new NotAcceptableException(
                'Order not found.',
            );
        }

        if (order.isClosed) {
            throw new NotAcceptableException(
                'Order already closed.',
            );
        }

        order.isClosed = true;

        return await this.orderRepository.save(order);
    }

    async create() {
        const payload: OrderFillableFields = {
            request: [],
            total: 0,
            isClosed: false,
        };

        return await this.orderRepository.save(
            this.orderRepository.create(payload),
        );
    }
}
