import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from '../order';

@Entity({
    name: 'requestItem',
})
export class RequestItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Order, order => order.request, {onDelete: 'CASCADE'})
    order: Order;

    @Column({length: 255})
    name: string;

    @Column()
    amount: number;

    @Column({nullable: false, type: 'float'})
    price: number;

    @Column({length: 255})
    type: string;
}

export class RequestItemFillableFields {
    name: string;
    amount: number;
    price: number;
    type: string;
}
