import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { Order } from '../order';
import { Table } from '../table';

@Entity({
    name: 'places',
})
export class Place {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Table, table => table.places, {onDelete: 'CASCADE'})
    table: Table;

    @Column({length: 255})
    name: string;

    @Column({default: 0})
    peopleCount: number;

    @OneToMany(type => Order, order => order.place, {eager: true, cascade: true})
    order: Order[];

    @Column({default: false})
    inUse: boolean;
}

export class PlaceFillableFields {
    name: string;
    peopleCount: number;
    order: Order[];
    inUse: boolean;
}
