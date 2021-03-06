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
const articleController = __importStar(require("../controllers/articleController"));
const authController = __importStar(require("../controllers/authController"));
const commentRoutes_1 = __importDefault(require("../routes/commentRoutes"));
const router = express_1.default.Router();
router.use('/:articleId/comments', commentRoutes_1.default);
router.route('/')
    .get(articleController.getArticles)
    .post(authController.protect, articleController.createArticle);
router.route('/filter').get(articleController.getFilter);
router.route('/count').get(articleController.getCountArticles);
router.route('/random').get(articleController.getRandomArticles);
router.route('/category/:categoryName/:numberOfPage?/:countOfPerPage?').get(articleController.getArticlesByCategory);
router.route('/author/:authorName/:numberOfPage?/:countOfPerPage?').get(articleController.getArticlesByAuthor);
router.route('/publisher/:publisherId/:numberOfPage?/:countOfPerPage?').get(articleController.getArticlesByPublisher);
router.route('/like/:articleId').get(authController.protect, articleController.likesArticle);
router.route('/:id')
    .get(articleController.getArticle)
    .patch(authController.protect, articleController.updateArticle)
    .delete(authController.protect, articleController.deleteArticle);
// router.get('/', (req, res) => {
//   res.send('hi there! articles');
// });
// router.post('/', )
exports.default = router;
