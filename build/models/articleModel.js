"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const articleSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, 'Title can not be empty!']
    },
    description: {
        type: String,
        required: [true, 'Description can not be empty!']
    },
    author: {
        type: String,
        required: [true, 'Author can not be empty!']
    },
    content: {
        type: String,
        required: [true, 'Content can not be empty!']
    },
    category: {
        type: String,
        default: 'Other'
    },
    priority: {
        type: Number,
        default: 1,
        min: [1, 'Priority should be greater than or equal to 1'],
        max: [10, 'Priority should be less than or equal to 10'],
    },
    private: {
        type: Boolean,
        default: false
    },
    publisher: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    imageUrl: String,
    imagesUrl: [String]
});
// Duplicate the ID field.
articleSchema.virtual('id').get(function () {
    //@ts-ignore
    return this._id.toHexString();
});
// Ensure virtual fields are serialised.
articleSchema.set('toJSON', {
    virtuals: true
});
const Article = mongoose_1.default.model('Article', articleSchema);
exports.default = Article;
