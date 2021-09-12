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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const list_1 = require("./routes/list");
const zip_1 = require("./routes/zip");
const util_1 = require("./util");
const path_1 = __importDefault(require("path"));
(async () => {
    if (process.env.NODE_ENV !== "production") {
        (await Promise.resolve().then(() => __importStar(require("dotenv")))).default.config({
            path: path_1.default.join(__dirname, "../../../.env"),
        });
    }
    const { PORT, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = process.env;
    try {
        const { data: { access_token }, } = await util_1.axios.post(`https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`);
        util_1.axios.defaults.headers["Authorization"] = `Bearer ${access_token}`;
        util_1.axios.defaults.headers["Client-Id"] = `${TWITCH_CLIENT_ID}`;
        util_1.log.info("Connected to Twitch");
    }
    catch (e) {
        util_1.log.error("Error connecting to Twitch");
        throw e;
    }
    if (process.env.NODE_ENV !== "production") {
        util_1.app.use((0, morgan_1.default)("tiny", {
            stream: {
                write(s) {
                    util_1.log.http(s.trim());
                },
            },
        }));
    }
    util_1.app.use(express_1.default.json());
    util_1.app.use("/api/list", list_1.listRoute);
    util_1.app.use("/api/zip", zip_1.zipRoute);
    if (process.env.NODE_ENV !== "production") {
        const proxy = (await Promise.resolve().then(() => __importStar(require("http-proxy")))).default.createProxyServer({
            target: "http://localhost:3001",
            ws: true,
        });
        util_1.app.use((req, res) => {
            try {
                proxy.web(req, res);
            }
            catch { }
        });
        util_1.server.on("upgrade", (req, socket, head) => {
            try {
                proxy.ws(req, socket, head);
            }
            catch { }
        });
    }
    else {
        util_1.app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist")));
        util_1.app.use((req, res) => {
            res.sendFile(path_1.default.join(__dirname, "../../frontend/dist/index.html"));
        });
    }
    util_1.server.listen(PORT);
    util_1.log.info(`HTTP listening on :${PORT}`);
})();
