"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMe = exports.getUser = exports.getUsers = exports.uploadUserPhoto = void 0;
const multer_1 = __importDefault(require("multer"));
const errors_1 = require("../utils/errors");
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
// import { BadRequestError } from '../utils/errors/bad-request-error';
const multerStorage = multer_1.default.diskStorage({
    destination: (req, res, cb) => {
        // cb(null, './uuu')
        cb(null, 'build/public/img/users');
    },
    filename: (req, file, cb) => {
        var _a;
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${(_a = req.user) === null || _a === void 0 ? void 0 : _a._id}-${Date.now()}.${ext}`);
    }
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new errors_1.BadRequestError('Not an image! Please upload only images.', 400), false);
    }
};
const upload = multer_1.default({
    storage: multerStorage,
    fileFilter: multerFilter
});
// const upload = multer({ dest: '../../build/public/img/users' });
exports.uploadUserPhoto = upload.single('photo');
exports.getUsers = catchAsync_1.default(async (req, res, next) => {
    const users = await userModel_1.default.find({});
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});
exports.getUser = catchAsync_1.default(async (req, res, next) => {
    // const isValidId = mongoose.Types.ObjectId.isValid(req.params.id)
    const user = await userModel_1.default.findOne({ _id: req.params.id });
    if (!user) {
        throw new errors_1.BadRequestError(`This route is not found (_id: ${req.params.id})`, 404);
        // throw new NotFoundError();
    }
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
// photo - https://sun9-23.userapi.com/iF2G3PzlBo98CQWy6yQ_EwRVN1h2FnQNVpBSRw/78DA2RMPkZw.jpg?ava=1
exports.updateMe = catchAsync_1.default(async (req, res) => {
    var _a;
    console.log('req.file', req.file);
    console.log('req.body', req.body);
    // console.log('id', req.user?._id);
    const user = await userModel_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
