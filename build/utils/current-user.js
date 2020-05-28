"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const currentUser = async (req, res, next) => {
    var _a;
    if (!((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt)) {
        req.user = null;
        return next();
    }
    const token = req.cookies.jwt;
    try {
        const decoded = jsonwebtoken_1.default.verify('token', process.env.JWT_SECRET);
        const user = await userModel_1.default.findById(decoded.id);
        req.user = user;
    }
    catch (error) {
        req.user = null;
    }
    next();
};
exports.default = currentUser;
