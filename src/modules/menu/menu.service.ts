import * as crypto from 'crypto';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Menu, MenuFillableFields } from './menu.entity';

@Injectable()
export class MenusService {

    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
    ) {
    }

    async get(id: number) {
        return this.menuRepository.findOne(id);
    }

    async getAll() {
        return this.menuRepository.find();
    }

    async getByName(name: string) {
        return await this.menuRepository.createQueryBuilder('menu')
            .where('menu.name = :name')
            .setParameter('name', name)
            .getOne();
    }

    async create(payload: MenuFillableFields) {
        const user = await this.getByName(payload.name);

        if (user) {
            throw new NotAcceptableException(
                'Item menu with provided name already created.',
            );
        }

        return await this.menuRepository.save(
            this.menuRepository.create(payload),
        );
    }

    async delete(menuId: number) {
        const menu = await this.get(menuId);

        if (!menu) {
            throw new NotAcceptableException(
                'Item menu not exist.',
            );
        }

        return await this.menuRepository.delete(menuId);
    }
}
