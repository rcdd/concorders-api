import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
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
}

export class MenuTypeFillableFields {
    id: number;
    name: string;
    menu: Menu;
}
