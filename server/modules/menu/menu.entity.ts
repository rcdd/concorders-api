import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column({length: 100})
    type: string;
}

export class MenuFillableFields {
    name: string;
    type: string;
}
