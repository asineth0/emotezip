"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRoute = void 0;
const express_1 = __importDefault(require("express"));
const util_1 = require("../util");
const joi_1 = __importDefault(require("joi"));
const app = express_1.default.Router();
app.post("/", async (req, res) => {
    if (!(0, util_1.validateBody)(joi_1.default.object({
        username: joi_1.default.string()
            .required()
            .regex(/^[a-zA-Z0-9_]{4,25}$/),
    }), req, res)) {
        return;
    }
    let id;
    try {
        id = (await util_1.axios.get(`https://api.twitch.tv/helix/users?login=${req.body.username}`)).data.data[0].id;
    }
    catch (_e) {
        const e = _e;
        return res.status(+(e?.code || 500)).json({
            error: e?.response?.data.message || e.message,
        });
    }
    let emotes;
    try {
        emotes = (await util_1.axios.get(`https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${id}`)).data.data.map((d) => ({
            id: d.id,
            name: d.name,
            url: Object.values(d.images).pop(),
            tier: +d.tier,
        }));
    }
    catch (_e) {
        const e = _e;
        return res.status(+(e?.code || 500)).json({
            error: e?.response?.data.message || e.message,
        });
    }
    res.json(emotes);
    res.end();
});
exports.listRoute = app;
