import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RequestItem } from './request-item.entity';

@Injectable()
export class RequestItemsService {

    constructor(
        @InjectRepository(RequestItem)
        private readonly requestItemRepository: Repository<RequestItem>,
    ) {
    }

    async get(id: number) {
        return this.requestItemRepository.findOne(id);
    }

    async delete(requestId: number) {
        const request = await this.get(requestId);

        if (!request) {
            throw new NotAcceptableException(
                'Request not exist.',
            );
        }

        return await this.requestItemRepository.delete(requestId);
    }
}
