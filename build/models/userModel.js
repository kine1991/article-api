"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import crypto from 'crypto';
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    passwordConfirm: {
        type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
// Duplicate the ID field.
userSchema.virtual('id').get(function () {
    //@ts-ignore
    return this._id.toHexString();
});
// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
    virtuals: true
});
userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password'))
        return next();
    // Hash the password with cost of 12
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
