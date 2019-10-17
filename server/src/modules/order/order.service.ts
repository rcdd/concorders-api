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
        return await this.orderRepository.findOne(id);
    }

    async getWithRequest(id: number) {
        return await this.orderRepository.createQueryBuilder('order')
            .innerJoinAndSelect('order.request', 'request')
            .innerJoinAndSelect('request.menuItem', 'menuItem')
            .where('order.id = :id')
            .setParameter('id', id)
            .getOne();
    }

    async getWithPlace(id: number) {
        return await this.orderRepository.createQueryBuilder('order')
            .innerJoinAndSelect('order.place', 'place')
            .where('order.id = :id')
            .setParameter('id', id)
            .getOne();
    }

    async sumTotal(order: OrderFillableFields): Promise<number> {
        let total = 0;

        order.request.forEach(item => {
            total += (item.menuItem.price * item.amount);
        });
        return total;
    }

    async getActiveOrder(placeId: number) {
        return await this.orderRepository.createQueryBuilder('order')
            .innerJoinAndSelect('order.request', 'request')
            .innerJoinAndSelect('request.menuItem', 'menuItem')
            .where('order.place = :placeId')
            .andWhere('order.isClosed = false')
            .setParameter('placeId', placeId)
            .getOne();
    }

    async updateOrder(orderId: number, requests: RequestItemFillableFields[]) {
        let order = await this.getWithRequest(orderId);

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

        for (const item of requests) {
            if (item.amount === 0) {
                order = await this.checkToRemove(order, item);
            } else {
                order = await this.checkToAdd(order, item);
            }
        }

        order.total = await this.sumTotal(order);

        if (order.request.length === 0) {
            await this.orderRepository.save(order);
            return await this.closeOrder(orderId);
        }

        return await this.orderRepository.save(order);
    }

    async checkToRemove(order, item) {
        if (item.id) {
            await this.requestItemService.delete(item.id);
            const index = await order.request.findIndex(r => r.id === item.id);
            order.request.splice(index, 1);
            order.total = await this.sumTotal(order);
            await this.orderRepository.update(order.id, {total: order.total});
            return order;
        } else {
            return order;
        }
    }

    async checkToAdd(order, item) {
        const elm = order.request.find(e => e.menuItem.name === item.menuItem.name);
        if (elm) {
            elm.amount = item.amount;
        } else if (item.amount && item.amount > 0) {
            const newItem = new RequestItem();
            Object.assign(newItem, item);
            order.request.push(newItem);
        }
        return order;
    }

    async closeOrder(id: number) {
        const order = await this.getWithPlace(id);

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
