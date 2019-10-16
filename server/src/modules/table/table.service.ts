import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Table, TableFillableFields } from './table.entity';
import { Place, PlacesService } from '../place';

@Injectable()
export class TablesService {

    constructor(
        @InjectRepository(Table)
        private readonly tableRepository: Repository<Table>,
        private readonly placeService: PlacesService,
    ) {
    }

    async get(id: number) {
        return this.tableRepository.findOne(id, {relations: ['places']});
    }

    async getFullDetails() {
        return this.tableRepository.find({relations: ['places']});
    }

    async getTables() {
        return await this.tableRepository.find({
            order: {
                name: 'ASC',
            }
        });
    }

    async getByName(name: string) {
        return await this.tableRepository.createQueryBuilder('table')
            .where('table.name = :name')
            .setParameter('name', name)
            .getOne();
    }

    async belongsTo(tableId: number, placeId: number) {
        return await this.tableRepository.createQueryBuilder('table')
            .innerJoinAndSelect('table.places', 'place')
            .where('table.id = :tableId')
            .andWhere('place.id = :placeId')
            .setParameter('tableId', tableId)
            .setParameter('placeId', placeId)
            .getOne();
    }

    async changeName(tableId: number, newName: string) {
        const table = await this.get(tableId);

        if (!table) {
            throw new NotAcceptableException(
                'Table not found.',
            );
        }

        if (await this.getByName(newName)) {
            throw new NotAcceptableException(
                'Table name already exist.',
            );
        }

        table.name = newName;

        return await this.tableRepository.save(table);
    }

    async addPlace(tableId: number, placeId: number) {
        const table = await this.get(tableId);

        if (!table) {
            throw new NotAcceptableException(
                'Table not exist.',
            );
        }

        const place = await this.placeService.get(placeId);

        if (!place) {
            throw new NotAcceptableException(
                'Place not exist.',
            );
        }

        if (await this.belongsTo(tableId, placeId)) {
            throw new NotAcceptableException(
                'Place already added to this table.',
            );
        }

        table.places.push(place);
        table.placesCount++;

        return await this.tableRepository.save(table);

    }

    async create(payload: TableFillableFields) {
        const table = await this.getByName(payload.name);

        if (table) {
            throw new NotAcceptableException(
                'Table with provided name already created.',
            );
        }

        payload.placesCount = 0;

        return await this.tableRepository.save(
            this.tableRepository.create(payload),
        );
    }

    async delete(tableId: number) {
        const table = await this.get(tableId);

        if (!table) {
            throw new NotAcceptableException(
                'Table not exist.',
            );
        }

        return await this.tableRepository.delete(tableId);
    }
}
