import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Country } from "./Country";
import { Airport } from "./Airport";

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  country_id!: number;

  @Column()
  is_active!: boolean;

  @Column()
  lat!: number;

  @Column()
  long!: number;

  @ManyToOne(() => Country, country => country.cities)
  country!: Country;

  @OneToMany(() => Airport, airport => airport.city)
  airports!: Airport[];
}
