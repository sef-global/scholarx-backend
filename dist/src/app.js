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
exports.startServer = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dbConfig_1 = require("./configs/dbConfig");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const profile_route_1 = __importDefault(require("./routes/profile/profile.route"));
const passport_1 = __importDefault(require("passport"));
require("./configs/passport");
const envConfig_1 = require("./configs/envConfig");
const port = envConfig_1.SERVER_PORT;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(passport_1.default.initialize());
app.get('/', (req, res) => {
    res.send('ScholarX Backend');
});
app.use('/api/auth', auth_route_1.default);
app.use('/api/me', profile_route_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dbConfig_1.dataSource.initialize();
        console.log('DB connection is successful');
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
        return app;
    }
    catch (err) {
        console.log('DB connection was not successful', err);
        throw err;
    }
});
exports.startServer = startServer;
exports.default = exports.startServer;
