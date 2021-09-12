import express, { Request, Response } from "express";
import Joi from "joi";
import JSZip from "jszip";
import sharp from "sharp";
import { validateBody, axios } from "../util";
import Promise from "bluebird";

const app = express.Router();

app.post("/", async (req: Request, res: Response) => {
  if (
    !validateBody(
      Joi.object({
        list: Joi.array()
          .required()
          .min(1)
          .max(100)
          .items(
            Joi.object({
              id: Joi.string().required().min(1).max(64),
              name: Joi.string().required().min(1).max(64),
            })
          ),
        size: Joi.number().required().min(8).max(128),
      }),
      req,
      res
    )
  ) {
    return;
  }

  const zip = new JSZip();

  try {
    await Promise.map(
      req.body.list,
      async (emote: any) => {
        const { data } = await axios.get(
          `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/static/light/3.0`,
          {
            responseType: "arraybuffer",
          }
        );

        zip.file(
          `${emote.name}.png`,
          await sharp(data)
            .resize(req.body.size)
            .png({
              compressionLevel: 9,
            })
            .toBuffer()
        );
      },
      {
        concurrency: 10,
      }
    );
  } catch (e) {
    return res.status(500).json({
      error: (e as Error).message,
    });
  }

  res.header("content-type", "application/zip");
  zip.generateNodeStream().pipe(res);
});

export const zipRoute = app;
