import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './place.entity';
import { PlacesService } from './place.service';
import { OrderModule } from '../order';

@Module({
    imports: [
        TypeOrmModule.forFeature([Place]),
        OrderModule,
    ],
    exports: [PlacesService],
    providers: [
        PlacesService,
    ],
})
export class PlaceModule {
}
