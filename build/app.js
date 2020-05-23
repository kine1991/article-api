"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
// @ts-ignore
const xss_clean_1 = __importDefault(require("xss-clean"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const articleRoutes_1 = __importDefault(require("./routes/articleRoutes"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const not_found_page_1 = require("./utils/errors/not-found-page");
const app = express_1.default();
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet_1.default());
// Development logging
if (process.env.NODE_ENV === 'development') {
    morgan_1.default('dev');
}
// Limit requests from same API
const limiter = express_rate_limit_1.default({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
// bodyParser
// app.use(bodyParser.urlencoded({ extended: true }));
// Body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: '10kb' })); // for parsing application/json
app.use(express_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// Data sanitization against NoSQL query injection
app.use(express_mongo_sanitize_1.default());
// Data sanitization against XSS
app.use(xss_clean_1.default());
// ROUTES
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/articles', articleRoutes_1.default);
// app.all('*', async (req: Request, res: Response, next: NextFunction) => {
//   res.status(404).json({
//     message: 'This route not found'
//   });
// });
app.all('*', async (req, res, next) => {
    throw new not_found_page_1.NotFoundError();
});
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error('err@', err.message);
//   res.status(200).json({
//     status: 'error',
//     message: 'message'
//   })
// });
app.use(errorController_1.default);
exports.default = app;
