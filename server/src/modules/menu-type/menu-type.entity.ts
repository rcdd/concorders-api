import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Menu } from '../menu';

@Entity({
    name: 'menu-type',
})
export class MenuType {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => Menu, menu => menu.type)
    menu: Menu;

    @Column({length: 255})
    name: string;

    @Column({length: 255})
    icon: string;
}

export class MenuTypeFillableFields {
    id: number;
    name: string;
    menu: Menu;
    icon: string;
}
