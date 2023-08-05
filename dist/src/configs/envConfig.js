"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.SERVER_PORT = exports.DB_PORT = exports.DB_PASSWORD = exports.DB_NAME = exports.DB_HOST = exports.DB_USER = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DB_USER = process.env.DB_USER;
exports.DB_HOST = process.env.DB_HOST;
exports.DB_NAME = process.env.DB_NAME;
exports.DB_PASSWORD = process.env.DB_PASSWORD;
exports.DB_PORT = process.env.DB_PORT;
exports.SERVER_PORT = (_a = process.env.SERVER_PORT) !== null && _a !== void 0 ? _a : 3000;
exports.JWT_SECRET = process.env.JWT_SECRET;
