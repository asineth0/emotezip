"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = exports.axios = exports.log = exports.server = exports.app = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const winston_1 = __importDefault(require("winston"));
const axios_1 = __importDefault(require("axios"));
exports.app = (0, express_1.default)();
exports.server = http_1.default.createServer(exports.app);
exports.log = winston_1.default.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), winston_1.default.format.printf((i) => `${i.timestamp} ${i.level}: ${i.message}`)),
    transports: [new winston_1.default.transports.Console()],
});
exports.axios = axios_1.default;
const validateBody = (schema, req, res) => {
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({
            error: error.message,
        });
    }
    return !error;
};
exports.validateBody = validateBody;
