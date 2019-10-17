import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany } from 'typeorm';
import { MenuType } from '../menu-type';
import { RequestItem } from '../request-item';

@Entity({
    name: 'menus',
})
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255})
    name: string;

    @Column({type: 'float'})
    price: number;

    @ManyToOne(type => MenuType, menuType => menuType.menu, {eager: true})
    type: MenuType;
}

export class MenuFillableFields {
    id: number;
    name: string;
    price: number;
    type: MenuType;
}
