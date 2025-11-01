"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/admin/adminRoutes"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const errorHandler_1 = __importDefault(require("./helpers/errorHandler"));
const app = (0, express_1.default)();
exports.app = app;
// default middleware
app.use((0, cors_1.default)({
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_ADMIN],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'PATCH'],
    credentials: true,
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 50,
    handler: (req, res, next) => {
        console.log(`Rate limit hit`);
        res.status(429).json({ message: 'Too many requests, slow down!' });
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('short'));
app.use(express_1.default.json({
    limit: '5mb',
}));
app.use(body_parser_1.default.urlencoded({
    extended: true,
    limit: '5mb',
}));
app.use(express_1.default.static('./public'));
// error handler
(0, errorHandler_1.default)();
// user routes api
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/admin', adminRoutes_1.default);
// server check api
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('World Hindu Vision Server is running');
}));
