import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from '../order';
import { Menu } from '../menu';

@Entity({
    name: 'requestItem',
})
export class RequestItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Order, order => order.request, {onDelete: 'CASCADE'})
    order: Order;

    @ManyToOne(type => Menu)
    menuItem: Menu;

    @Column()
    amount: number;
}

export class RequestItemFillableFields {
    order: Order;
    menuItem: Menu;
    amount: number;
}
