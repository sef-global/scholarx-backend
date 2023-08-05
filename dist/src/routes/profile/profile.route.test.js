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
const app_1 = require("../../app");
const supertest_1 = __importDefault(require("supertest"));
describe('profile', () => {
    let server;
    describe('Get profile route', () => {
        let accessToken;
        const randomString = Math.random().toString(36).substr(2, 5);
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            server = yield (0, app_1.startServer)();
            const testUser = {
                email: `test${randomString}@gmail.com`,
                password: '123'
            };
            yield (0, supertest_1.default)(server)
                .post('/api/auth/register')
                .send(testUser)
                .expect(201);
            const response = yield (0, supertest_1.default)(server)
                .post('/api/auth/login')
                .send(testUser)
                .expect(200);
            accessToken = response.body.token;
        }), 5000);
        it('should return a 401 without a valid access token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(server).get('/api/me/profile').expect(401);
        }));
        it('should return a 200 with a user profile object', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server)
                .get('/api/me/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);
            expect(response.body).toHaveProperty('created_at');
            expect(response.body).toHaveProperty('updated_at');
            expect(response.body).toHaveProperty('primary_email');
            expect(response.body).toHaveProperty('contact_email');
            expect(response.body).toHaveProperty('first_name');
            expect(response.body).toHaveProperty('last_name');
            expect(response.body).toHaveProperty('image_url');
            expect(response.body).toHaveProperty('linkedin_url');
            expect(response.body).toHaveProperty('type');
            expect(response.body).toHaveProperty('uuid');
        }));
    });
});
