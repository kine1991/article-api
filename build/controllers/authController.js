"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = exports.logout = exports.checkAuth = exports.currentUser = exports.signUp = exports.signIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const util_1 = require("util");
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const bad_request_error_1 = require("../utils/errors/bad-request-error");
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
        // expiresIn: process.env.JWT_EXPIRES_IN
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
        //@ts-ignore
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    //@ts-ignore
    if (process.env.NODE_ENV === 'production')
        cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    // Remove password from output
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};
exports.signIn = catchAsync_1.default(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new bad_request_error_1.BadRequestError('Please provide email and password!', 400);
    }
    const existingUser = await userModel_1.default.findOne({ email: req.body.email }).select('+password');
    if (!existingUser) {
        throw new bad_request_error_1.BadRequestError('Incorrect email or password!', 401);
    }
    const comparePassword = await bcryptjs_1.default.compare(password, existingUser.password);
    if (!comparePassword) {
        throw new bad_request_error_1.BadRequestError('Incorrect email or password!', 401);
    }
    createSendToken(existingUser, 200, res);
});
exports.signUp = catchAsync_1.default(async (req, res, next) => {
    const existingUser = await userModel_1.default.findOne({ email: req.body.email });
    if (existingUser) {
        throw new bad_request_error_1.BadRequestError('This email was already taken', 400);
    }
    const newUser = await userModel_1.default.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    createSendToken(newUser, 201, res);
});
exports.currentUser = (req, res) => {
    res.json({
        status: "success",
        data: {
            user: req.user
        }
    });
};
exports.checkAuth = async (req, res) => {
    var _a, _b;
    try {
        let user;
        if (!((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt)) {
            console.log('cookies', (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.jwt);
            user = null;
        }
        else {
            const token = req.cookies.jwt;
            const decoded = await util_1.promisify(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET);
            user = await userModel_1.default.findById(decoded.id);
        }
        res.json({
            status: "success",
            data: {
                user: user
            }
        });
    }
    catch (error) {
        console.log('checkAuth - error: ', error);
        res.json({
            status: "success",
            data: {
                user: null
            }
        });
    }
};
exports.logout = (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(Date.now() + 10 * 100),
        httpOnly: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            user: null
        }
    });
};
exports.protect = async (req, res, next) => {
    var _a;
    try {
        if (!((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt)) {
            next(new bad_request_error_1.BadRequestError('You are not logged in! Please log in to get access.', 401));
        }
        const token = req.cookies.jwt;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const currentUser = await userModel_1.default.findById(decoded.id);
        if (!currentUser) {
            next(new bad_request_error_1.BadRequestError('The user belonging to this token does no longer exist.', 401));
        }
        req.user = currentUser;
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(new bad_request_error_1.BadRequestError('invalid token.', 401));
        }
        next(new bad_request_error_1.BadRequestError('Something went wrong', 500));
        // console.log('error@', error);
    }
};
