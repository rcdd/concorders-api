import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MenuType, MenuTypeFillableFields } from './menu-type.entity';

@Injectable()
export class MenuTypeService {

    constructor(
        @InjectRepository(MenuType)
        private readonly menuTypeRepository: Repository<MenuType>
    ) {
    }

    async get(id: number) {
        return await this.menuTypeRepository.findOne(id);
    }

    async getAll() {
        return await this.menuTypeRepository.find();
    }

    async getByName(name: string) {
        return await this.menuTypeRepository.createQueryBuilder('menu-type')
            .where('menu-type.name = :name')
            .setParameter('name', name)
            .getOne();
    }

    async update(payload: MenuTypeFillableFields) {
        const menuType = await this.get(payload.id);

        if (!menuType) {
            throw new NotAcceptableException(
                'Menu type not found.',
            );
        }

        if (payload.name !== menuType.name) {
            const checkMenuType = await this.getByName(payload.name);
            if (checkMenuType) {
                throw new NotAcceptableException(
                    'Menu type with provided name already exist.',
                );
            }

            menuType.name = payload.name;
        }

        menuType.icon = payload.icon;

        return await this.menuTypeRepository.save(menuType);
    }

    async create(payload: MenuTypeFillableFields) {
        const menuType = await this.getByName(payload.name);

        if (menuType) {
            throw new NotAcceptableException(
                'Menu type with provided name already created.',
            );
        }

        return await this.menuTypeRepository.save(
            this.menuTypeRepository.create(payload),
        );
    }

    async delete(menuItemId: number) {
        const menuType = await this.menuTypeRepository.findOne(menuItemId, {relations: ['menu']});

        if (!menuType) {
            throw new NotAcceptableException(
                'Menu item not exist.',
            );
        }

        try {
            return await this.menuTypeRepository.delete(menuItemId);
        } catch (e) {
            if (e.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new NotAcceptableException(
                    'Menu item has products. Please remove they first.',
                );
            }
        }
    }
}
