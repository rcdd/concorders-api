import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Place, PlaceFillableFields } from './place.entity';
import { Order, OrderFillableFields, OrdersService } from '../order';
import { RequestItem } from '../request-item';

@Injectable()
export class PlacesService {

    constructor(
        @InjectRepository(Place)
        private readonly placeRepository: Repository<Place>,
        private readonly orderService: OrdersService,
    ) {
    }

    async get(id: number) {
        return await this.placeRepository.findOne(id);
    }

    async getByName(name: string) {
        return await this.placeRepository.createQueryBuilder('place')
            .where('place.name = :name')
            .setParameter('name', name)
            .getOne();
    }

    async getPlaces(tableId: number) {
        return await this.placeRepository.createQueryBuilder('place')
            .where('place.tableId = :tableId')
            .setParameter('tableId', tableId)
            .orderBy('place.name')
            .getMany();
    }

    async changeName(placeId: number, newName: string) {
        const place = await this.get(placeId);

        if (!place) {
            throw new NotAcceptableException(
                'Place not found.',
            );
        }

        if (place.inUse) {
            throw new NotAcceptableException(
                'Place in use.',
            );
        }

        place.name = newName;

        return await this.placeRepository.save(place);
    }

    async addOrder(placeId: number, _order: OrderFillableFields) {
        const place = await this.get(placeId);

        if (!place) {
            throw new NotAcceptableException(
                'Place not found.',
            );
        }

        if (place.inUse) {
            throw new NotAcceptableException(
                'Place already in use.',
            );
        }
        if (_order.request.length === 0) {
            throw new NotAcceptableException(
                'Order without any request.',
            );
        }

        const order = new Order();

        place.order.push(order);

        order.request = [];
        await _order.request.forEach(_request => {
            const request = new RequestItem();
            request.menuItem = _request.menuItem;
            request.amount = _request.amount;
            order.request.push(request);
        });

        order.total = await this.orderService.sumTotal(order);

        place.inUse = true;

        return await this.placeRepository.save(place);
    }

    async closePlace(placeId) {
        const place = await this.get(placeId);

        if (!place) {
            throw new NotAcceptableException(
                'Place not found.',
            );
        }
        place.inUse = false;
        place.peopleCount = 0;

        return await this.placeRepository.save(place);
    }

    async create(payload: PlaceFillableFields) {
        const place = await this.getByName(payload.name);

        if (place) {
            throw new NotAcceptableException(
                'Place with provided name already created.',
            );
        }

        return await this.placeRepository.save(
            this.placeRepository.create(payload),
        );
    }

    async delete(placeId: number) {
        const place = await this.placeRepository.findOne(placeId, {relations: ['table']});

        if (!place) {
            throw new NotAcceptableException(
                'Place not exist.',
            );
        }

        if (place.table && place.table.placesCount > 0) {
            place.table.placesCount--;
        }

        return await this.placeRepository.delete(placeId);
    }
}
