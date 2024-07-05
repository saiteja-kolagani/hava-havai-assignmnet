"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const Airport_1 = require("./entity/Airport");
(0, typeorm_1.createConnection)().then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const PORT = process.env.PORT || 3000;
    app.get('/airport/:iata_code', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { iata_code } = req.params;
        try {
            const airport = yield connection
                .getRepository(Airport_1.Airport)
                .createQueryBuilder('airport')
                .leftJoinAndSelect('airport.city', 'city')
                .leftJoinAndSelect('city.country', 'country')
                .where('airport.iata_code = :iata_code', { iata_code })
                .getOne();
            if (!airport) {
                return res.status(404).json({ error: 'Airport not found' });
            }
            const response = {
                airport: {
                    id: airport.id,
                    icao_code: airport.icao_code,
                    iata_code: airport.iata_code,
                    name: airport.name,
                    type: airport.type,
                    latitude_deg: airport.latitude_deg,
                    longitude_deg: airport.longitude_deg,
                    elevation_ft: airport.elevation_ft,
                    address: {
                        city: {
                            id: airport.city.id,
                            name: airport.city.name,
                            country_id: airport.city.country ? airport.city.country.id : null,
                            is_active: airport.city.is_active,
                            lat: airport.city.lat,
                            long: airport.city.long,
                        },
                        country: airport.city.country
                            ? {
                                id: airport.city.country.id,
                                name: airport.city.country.name,
                                country_code_two: airport.city.country.country_code_two,
                                country_code_three: airport.city.country.country_code_three,
                                mobile_code: airport.city.country.mobile_code,
                                continent_id: airport.city.country.continent_id,
                            }
                            : null,
                    },
                },
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error fetching airport data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }));
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})).catch(error => console.log('Error connecting to the database:', error));
