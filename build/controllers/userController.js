"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateMe = exports.getUser = exports.getUsers = exports.uploadUserPhoto = void 0;
const multer_1 = __importDefault(require("multer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// import sharp from 'sharp';
const errors_1 = require("../utils/errors");
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const multerStorage = multer_1.default.diskStorage({
    destination: (req, res, cb) => {
        // cb(null, './uuu')
        cb(null, 'build/public/images/users');
    },
    filename: (req, file, cb) => {
        var _a;
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${(_a = req.user) === null || _a === void 0 ? void 0 : _a._id}-${Date.now()}.${ext}`);
    }
});
// const multerStorage = multer.memoryStorage();
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
// export const resizeUserPhoto = catchAsync( async(req: Request, res: Response, next: NextFunction) => {
//   if (!req.file) return next();
//   req.file.filename = `user-${req.user?._id}-${Date.now()}.jpeg`;
//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`build/public/images/users/${req.file.filename}`);
//   next();
// });
exports.getUsers = catchAsync_1.default(async (req, res, next) => {
    const users = await userModel_1.default.find({});
    console.log(users);
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
    const url = req.protocol + '://' + req.get('host');
    const filterObj = (obj, ...allowedFields) => {
        const newObj = {};
        Object.keys(obj).forEach(el => {
            if (allowedFields.includes(el))
                newObj[el] = obj[el];
        });
        return newObj;
    };
    const filteredBody = filterObj(req.body, 'name', 'email', 'photo');
    if (req.file)
        filteredBody.photo = url + '/images/users/' + req.file.filename;
    const user = await userModel_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, filteredBody, {
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
exports.changePassword = catchAsync_1.default(async (req, res) => {
    var _a;
    const user = await userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select('+password');
    const isCompare = await bcryptjs_1.default.compare(req.body.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isCompare)
        throw new errors_1.BadRequestError(`Your current password is wrong`, 401);
    if (req.body.newPassword !== req.body.newPasswordConfirm)
        throw new errors_1.BadRequestError(`Your newPassword do not match newPasswordConfirm`, 401);
    if (req.body.password === req.body.newPassword)
        throw new errors_1.BadRequestError(`Your password should not match newPassword`, 401);
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPassword;
    await (user === null || user === void 0 ? void 0 : user.save());
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
