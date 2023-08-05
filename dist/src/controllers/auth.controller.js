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
exports.requireAuth = exports.login = exports.register = void 0;
const dbConfig_1 = require("../configs/dbConfig");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const profile_entity_1 = __importDefault(require("../entities/profile.entity"));
const envConfig_1 = require("../configs/envConfig");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required fields' });
        }
        const profileRepository = dbConfig_1.dataSource.getRepository(profile_entity_1.default);
        const existingProfile = yield profileRepository.findOne({
            where: { primary_email: email }
        });
        if (existingProfile != null) {
            res.status(409).json({ error: 'Email already exists' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newProfile = profileRepository.create({
            primary_email: email,
            password: hashedPassword,
            contact_email: '',
            first_name: '',
            last_name: '',
            image_url: '',
            linkedin_url: ''
        });
        yield profileRepository.save(newProfile);
        res.status(201).json({
            uuid: newProfile.uuid,
            primary_email: newProfile.primary_email,
            contact_email: newProfile.contact_email,
            first_name: newProfile.first_name,
            last_name: newProfile.last_name,
            image_url: newProfile.image_url,
            linkedin_url: newProfile.linkedin_url
        });
    }
    catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required fields' });
        }
        const profileRepository = dbConfig_1.dataSource.getRepository(profile_entity_1.default);
        const profile = yield profileRepository
            .createQueryBuilder('profile')
            .addSelect('profile.password')
            .where({ primary_email: email })
            .getOne();
        if (profile == null) {
            res.status(401).json({ error: 'Invalid email or password' });
        }
        const passwordMatch = yield (profile === null || profile === void 0 ? void 0 : profile.comparePassword(password));
        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: profile === null || profile === void 0 ? void 0 : profile.uuid }, envConfig_1.JWT_SECRET !== null && envConfig_1.JWT_SECRET !== void 0 ? envConfig_1.JWT_SECRET : '', {
            expiresIn: '10h' // To-Do: Change value in production
        });
        res.json({ token });
    }
    catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.login = login;
const requireAuth = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (err, user) => {
        if (err) {
            next(err);
            return;
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorised' });
        }
        else {
            req.user = user;
            next();
        }
    })(req, res, next);
};
exports.requireAuth = requireAuth;
