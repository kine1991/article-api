"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import bodyParser from 'body-parser';
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
// @ts-ignore
const xss_clean_1 = __importDefault(require("xss-clean"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const articleRoutes_1 = __importDefault(require("./routes/articleRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const not_found_page_1 = require("./utils/errors/not-found-page");
const app = express_1.default();
// CORS
// app.use(cors());
if (process.env.NODE_ENV === 'development') {
    app.use(cors_1.default({ credentials: true, origin: 'http://localhost:4200' }));
}
else if (process.env.NODE_ENV === 'production') {
    app.use(cors_1.default({ credentials: true, origin: 'http://kron-article.s3-website.us-east-2.amazonaws.com' }));
}
else {
    // delete
    app.use(cors_1.default({ credentials: true, origin: 'http://localhost:4200' }));
}
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS, "
//   );
//   next();
// });
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
    windowMs: 15 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
// bodyParser
// app.use(bodyParser.urlencoded({ extended: true }));
// Body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: '10kb' })); // for parsing application/json
app.use(express_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// Serving static files
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// cookie
app.use(cookie_parser_1.default());
// Data sanitization against NoSQL query injection
app.use(express_mongo_sanitize_1.default());
// Data sanitization against XSS
app.use(xss_clean_1.default());
// ROUTES
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/articles', articleRoutes_1.default);
app.use('/api/v1/comments', commentRoutes_1.default);
app.all('*', async (req, res, next) => {
    next(new not_found_page_1.NotFoundError());
});
app.use(errorController_1.default);
exports.default = app;
