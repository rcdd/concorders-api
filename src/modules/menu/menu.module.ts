import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { MenusService } from './menu.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Menu]),
    ],
    exports: [MenusService],
    providers: [
        MenusService,
    ],
})
export class MenuModule {
}
