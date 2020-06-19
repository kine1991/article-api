"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// interface CommentModel extends mongoose.Model<CommentDoc> {
//   build(): CommentDoc;
// }
const commentSchema = new mongoose_1.default.Schema({
    comment: {
        type: String,
        required: [true, 'Comment is require!']
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Comment must belong to a user']
    },
    article: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Article',
        required: [true, 'Comment must belong to a article']
    }
});
// commentSchema.index({ article });
const Comment = mongoose_1.default.model('Comment', commentSchema);
exports.default = Comment;
