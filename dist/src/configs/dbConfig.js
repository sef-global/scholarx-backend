"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const envConfig_1 = require("./envConfig");
exports.dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: envConfig_1.DB_HOST,
    port: (_a = Number(envConfig_1.DB_PORT)) !== null && _a !== void 0 ? _a : 5432,
    username: envConfig_1.DB_USER,
    password: envConfig_1.DB_PASSWORD,
    database: envConfig_1.DB_NAME,
    entities: ['src/entities/*.ts'],
    logging: false,
    synchronize: true
});
