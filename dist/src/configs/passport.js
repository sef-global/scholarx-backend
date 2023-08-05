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
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const dbConfig_1 = require("./dbConfig");
const profile_entity_1 = __importDefault(require("../entities/profile.entity"));
const envConfig_1 = require("./envConfig");
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: envConfig_1.JWT_SECRET
};
passport_1.default.use(new passport_jwt_1.Strategy(options, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profileRepository = dbConfig_1.dataSource.getRepository(profile_entity_1.default);
        const profile = yield profileRepository.findOne({
            where: { uuid: jwtPayload.userId }
        });
        if (!profile) {
            done(null, false);
        }
        else {
            done(null, profile);
        }
    }
    catch (error) {
        done(error, false);
    }
})));
exports.default = passport_1.default;
