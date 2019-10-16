import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Place } from '../place';

@Entity({
    name: 'tables',
})
export class Table {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255})
    name: string;

    @OneToMany(type => Place, place => place.table, {cascade: true})
    places: Place[];

    @Column()
    placesCount: number;
}

export class TableFillableFields {
    name: string;
    places: Place[];
    placesCount: number;
}
