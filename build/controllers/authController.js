"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = exports.signUp = exports.signIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const bad_request_error_1 = require("../utils/errors/bad-request-error");
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
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
    const existingUser = await userModel_1.default.findOne({ email: req.body.email });
    if (!existingUser) {
        throw new bad_request_error_1.BadRequestError('Incorrect email or password!', 401);
    }
    if (!await bcryptjs_1.default.compare(password, existingUser.password)) {
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
exports.currentUser = catchAsync_1.default(async (req, res, next) => {
    var _a;
    console.log('cookies@', req.cookies.jwt);
    const token = req.cookies.jwt;
    if (!((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt)) {
        return res.json({
            currentUser: null
        });
    }
    else {
        // const decoded = await promisify(jwt.verify)('token', process.env.JWT_SECRET!)
        // console.log('decoded', decoded.id);
        jsonwebtoken_1.default.verify('token', process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.json({
                    currentUser: null
                });
            }
            // console.log('decoded', decoded) // bar
            // console.log('err', err) // bar
        });
        // const user = await User.findById(decoded.id);
        // console.log('user', user);
        // // res.json({
        // //   ss: "sss"
        // // });
        return res.send({});
    }
});
