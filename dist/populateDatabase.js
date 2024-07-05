"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Country_1 = require("./entity/Country");
const City_1 = require("./entity/City");
const Airport_1 = require("./entity/Airport");
const xlsx = __importStar(require("xlsx"));
function populateDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield (0, typeorm_1.createConnection)();
            // Read the Excel file from the local src directory
            const workbook = xlsx.readFile('src/Database.xlsx');
            const countriesSheet = workbook.Sheets['Country'];
            const citiesSheet = workbook.Sheets['City'];
            const airportsSheet = workbook.Sheets['Airport'];
            if (!countriesSheet || !citiesSheet || !airportsSheet) {
                throw new Error('One or more sheets not found in the Excel file');
            }
            const countries = xlsx.utils.sheet_to_json(countriesSheet).map(row => ({
                name: row['name'],
                country_code_two: row['country_code_two'],
                country_code_three: row['country_code_three'],
                mobile_code: row['mobile_code'],
                continent_id: row['continent_id'],
            }));
            const cities = xlsx.utils.sheet_to_json(citiesSheet).map(row => ({
                name: row['name'],
                country_id: row['country_id'],
                is_active: row['is_active'],
                lat: row['lat'],
                long: row['long'],
            }));
            const airports = xlsx.utils.sheet_to_json(airportsSheet).map(row => ({
                icao_code: row['icao_code'],
                iata_code: row['iata_code'],
                name: row['name'],
                type: row['type'],
                latitude_deg: row['latitude_deg'],
                longitude_deg: row['longitude_deg'],
                elevation_ft: row['elevation_ft'],
                city: row['city'],
            }));
            yield connection.manager.save(Country_1.Country, countries);
            yield connection.manager.save(City_1.City, cities);
            yield connection.manager.save(Airport_1.Airport, airports);
            yield connection.close();
            console.log('Database populated successfully');
        }
        catch (error) {
            console.error('Error populating database:', error);
        }
    });
}
populateDatabase().catch(console.error);
