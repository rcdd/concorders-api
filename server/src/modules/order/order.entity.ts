import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { RequestItem } from '../request-item';
import { Place } from '../place';

@Entity({
    name: 'orders',
})
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Place, place => place.order, {onDelete: 'CASCADE'})
    place: Place;

    @OneToMany(type => RequestItem, request => request.order, {eager: true, cascade: true})
    request: RequestItem[];

    @Column({default: 0, type: 'float'})
    total: number;

    @Column({default: false})
    isClosed: boolean;
}

export class OrderFillableFields {
    request: RequestItem[];
    total: number;
    isClosed: boolean;
}
