import express, { Request, Response } from "express";
import { axios, validateBody } from "../util";
import { AxiosError } from "axios";
import Joi from "joi";

const app = express.Router();

app.post("/", async (req: Request, res: Response) => {
  if (
    !validateBody(
      Joi.object({
        username: Joi.string()
          .required()
          .regex(/^[a-zA-Z0-9_]{4,25}$/),
      }),
      req,
      res
    )
  ) {
    return;
  }

  let id;

  try {
    id = (
      await axios.get(
        `https://api.twitch.tv/helix/users?login=${req.body.username}`
      )
    ).data.data[0].id;
  } catch (_e) {
    const e = _e as AxiosError;
    return res.status(+(e?.code || 500)).json({
      error: e?.response?.data.message || e.message,
    });
  }

  let emotes;

  try {
    emotes = (
      await axios.get(
        `https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${id}`
      )
    ).data.data.map((d: any) => ({
      id: d.id,
      name: d.name,
      url: Object.values(d.images).pop(),
      tier: +d.tier,
    }));
  } catch (_e) {
    const e = _e as AxiosError;
    return res.status(+(e?.code || 500)).json({
      error: e?.response?.data.message || e.message,
    });
  }

  res.json(emotes);
  res.end();
});

export const listRoute = app;
