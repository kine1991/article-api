"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController = __importStar(require("../controllers/commentController"));
const authController = __importStar(require("../controllers/authController"));
const router = express_1.default.Router({ mergeParams: true });
router.route('/')
    .get(commentController.getCommentsByArticle) // work for only: - /articles/:articleId/comments
    .post(authController.protect, commentController.createComment); // work only: /articles/:articleId/comments
router.route('/all').get(commentController.getComments);
router.route('/:commentId')
    .get(commentController.getComment) // work for both: - /comments/:commentId, - /articles/:articleId/comments/:commentId
    .patch(authController.protect, commentController.updateComment) // work both:  - /comments/:commentId, - /articles/:articleId/comments/:commentId
    .delete(authController.protect, commentController.deleteComment); // work both:  - /comments/:commentId, - /articles/:articleId/comments/:commentId
router.route('/:commentId/like').get(authController.protect, commentController.likesComment);
exports.default = router;
