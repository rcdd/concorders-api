import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { MenuType } from '../menu-type';

@Entity({
    name: 'menus',
})
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255})
    name: string;

    @Column({type: 'float'})
    price: string;

    @ManyToOne(type => MenuType, menuType => menuType.menu, {eager: true})
    type: MenuType;
}

export class MenuFillableFields {
    id: number;
    name: string;
    price: string;
    type: MenuType;
}
