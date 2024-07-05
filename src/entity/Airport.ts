import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { City } from './City';

@Entity()
export class Airport {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  icao_code!: string;

  @Column()
  iata_code!: string;

  @Column()
  name!: string;

  @Column()
  type!: string;

  @Column()
  latitude_deg!: number;

  @Column()
  longitude_deg!: number;

  @Column()
  elevation_ft!: number;

  @ManyToOne(() => City, city => city.airports)
  city!: City;
}
