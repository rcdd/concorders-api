import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuType } from './menu-type.entity';
import { MenuTypeService } from './menu-type.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([MenuType]),
    ],
    exports: [MenuTypeService],
    providers: [
        MenuTypeService,
    ],
})
export class MenuTypeModule {
}
