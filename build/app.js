"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const articleRoutes_1 = __importDefault(require("./routes/articleRoutes"));
const app = express_1.default();
// bodyParser
app.use(body_parser_1.default.urlencoded({ extended: true }));
// ROUTES
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/articles', articleRoutes_1.default);
exports.default = app;
