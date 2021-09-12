import { AxiosError, AxiosResponse, Method } from "axios";
import express, { Request, Response } from "express";
import { listRoute } from "./routes/list";
import { zipRoute } from "./routes/zip";
import { app, axios, log, server } from "./util";
import path from "path";

(async () => {
  if (process.env.NODE_ENV !== "production") {
    (await import("dotenv")).default.config({
      path: path.join(__dirname, "../../../.env"),
    });
  }

  const { PORT, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = process.env;

  try {
    const {
      data: { access_token },
    } = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
    );

    axios.defaults.headers["Authorization"] = `Bearer ${access_token}`;
    axios.defaults.headers["Client-Id"] = `${TWITCH_CLIENT_ID}`;
    log.info("Connected to Twitch");
  } catch (e) {
    log.error("Error connecting to Twitch");
    throw e;
  }

  if (process.env.NODE_ENV !== "production") {
    app.use(
      (await import("morgan")).default("tiny", {
        stream: {
          write(s) {
            log.http(s.trim());
          },
        },
      })
    );
  }

  app.use(express.json());

  app.use("/api/list", listRoute);
  app.use("/api/zip", zipRoute);

  if (process.env.NODE_ENV !== "production") {
    const proxy = (await import("http-proxy")).default.createProxyServer({
      target: "http://localhost:3001",
      ws: true,
    });

    app.use((req: Request, res: Response) => {
      try {
        proxy.web(req, res);
      } catch {}
    });

    server.on("upgrade", (req: any, socket: any, head: any) => {
      try {
        proxy.ws(req, socket, head);
      } catch {}
    });
  } else {
    app.use(express.static(path.join(__dirname, "../../frontend/dist")));
    app.use((req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
    });
  }

  server.listen(PORT);
  log.info(`HTTP listening on :${PORT}`);
})();
