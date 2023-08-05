"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profile_controller_1 = require("../../controllers/profile.controller");
const auth_controller_1 = require("../../controllers/auth.controller");
const profileRouter = express_1.default.Router();
profileRouter.get('/profile', auth_controller_1.requireAuth, profile_controller_1.getProfile);
exports.default = profileRouter;
