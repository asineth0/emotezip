"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zipRoute = void 0;
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const jszip_1 = __importDefault(require("jszip"));
const sharp_1 = __importDefault(require("sharp"));
const util_1 = require("../util");
const bluebird_1 = __importDefault(require("bluebird"));
const app = express_1.default.Router();
app.post("/", async (req, res) => {
    if (!(0, util_1.validateBody)(joi_1.default.object({
        list: joi_1.default.array()
            .required()
            .min(1)
            .max(100)
            .items(joi_1.default.object({
            id: joi_1.default.string().required().min(1).max(64),
            name: joi_1.default.string().required().min(1).max(64),
        })),
        size: joi_1.default.number().required().min(8).max(128),
    }), req, res)) {
        return;
    }
    const zip = new jszip_1.default();
    try {
        await bluebird_1.default.map(req.body.list, async (emote) => {
            const { data } = await util_1.axios.get(`https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/static/light/3.0`, {
                responseType: "arraybuffer",
            });
            zip.file(`${emote.name}_${emote.id}.png`, await (0, sharp_1.default)(data)
                .resize(req.body.size)
                .png({
                compressionLevel: 9,
            })
                .toBuffer());
        }, {
            concurrency: 10,
        });
    }
    catch (e) {
        return res.status(500).json({
            error: e.message,
        });
    }
    res.header("content-type", "application/zip");
    zip.generateNodeStream().pipe(res);
});
exports.zipRoute = app;
