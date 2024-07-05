import { createConnection } from 'typeorm';
import { Country } from './entity/Country';
import { City } from './entity/City';
import { Airport } from './entity/Airport';
import * as xlsx from 'xlsx';

async function populateDatabase() {
  try {
    const connection = await createConnection();

    // Read the Excel file from the local src directory
    const workbook = xlsx.readFile('src/Database.xlsx');

    const countriesSheet = workbook.Sheets['Country'];
    const citiesSheet = workbook.Sheets['City'];
    const airportsSheet = workbook.Sheets['Airport'];

    if (!countriesSheet || !citiesSheet || !airportsSheet) {
      throw new Error('One or more sheets not found in the Excel file');
    }

    const countries: Partial<Country>[] = xlsx.utils.sheet_to_json<Partial<Country>>(countriesSheet).map(row => ({
      name: row['name'],
      country_code_two: row['country_code_two'],
      country_code_three: row['country_code_three'],
      mobile_code: row['mobile_code'],
      continent_id: row['continent_id'],
    }));

    const cities: Partial<City>[] = xlsx.utils.sheet_to_json<Partial<City>>(citiesSheet).map(row => ({
      name: row['name'],
      country_id: row['country_id'],
      is_active: row['is_active'],
      lat: row['lat'],
      long: row['long'],
    }));

    const airports: Partial<Airport>[] = xlsx.utils.sheet_to_json<Partial<Airport>>(airportsSheet).map(row => ({
      icao_code: row['icao_code'],
      iata_code: row['iata_code'],
      name: row['name'],
      type: row['type'],
      latitude_deg: row['latitude_deg'],
      longitude_deg: row['longitude_deg'],
      elevation_ft: row['elevation_ft'],
      city: row['city'],
    }));

    await connection.manager.save(Country, countries);
    await connection.manager.save(City, cities);
    await connection.manager.save(Airport, airports);

    await connection.close();
    console.log('Database populated successfully');
  } catch (error) {
    console.error('Error populating database:', error);
  }
}

populateDatabase().catch(console.error);
