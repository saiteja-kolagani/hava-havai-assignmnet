import { createConnection } from "typeorm";
import { Country } from "./entity/Country";
import { City } from "./entity/City";
import { Airport } from "./entity/Airport";
import * as xlsx from "xlsx";

async function populateDatabase() {
  const connection = await createConnection();

  const workbook = xlsx.readFile("https://docs.google.com/spreadsheets/d/1CLIUfiw2MduzIXNUXNKLR7e8h8JBikqyfJwmGutt7Kw/edit?gid=835620982#gid=835620982");
  const countriesSheet = workbook.Sheets["Country"];
  const citiesSheet = workbook.Sheets["City"];
  const airportsSheet = workbook.Sheets["Airport"];

  const countries: Country[] = xlsx.utils.sheet_to_json(countriesSheet);
  const cities: City[] = xlsx.utils.sheet_to_json(citiesSheet);
  const airports: Airport[] = xlsx.utils.sheet_to_json(airportsSheet);

  await connection.manager.save(Country, countries);
  await connection.manager.save(City, cities);
  await connection.manager.save(Airport, airports);

  await connection.close();
}

populateDatabase().catch(console.error);
