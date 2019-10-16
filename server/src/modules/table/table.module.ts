import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from './table.entity';
import { TablesService } from './table.service';
import { PlaceModule } from '../place';

@Module({
    imports: [
        TypeOrmModule.forFeature([Table]),
        PlaceModule,
    ],
    exports: [TablesService],
    providers: [
        TablesService,
    ],
})
export class TableModule {
}
