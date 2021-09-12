import http from "http";
import express, { Request, Response } from "express";
import winston from "winston";
import Axios from "axios";
import { Schema } from "joi";

export const app = express();

export const server = http.createServer(app);

export const log = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf((i) => `${i.timestamp} ${i.level}: ${i.message}`)
  ),
  transports: [new winston.transports.Console()],
});

export const axios = Axios;

export const validateBody = (
  schema: Schema,
  req: Request,
  res: Response
): boolean => {
  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).json({
      error: error.message,
    });
  }

  return !error;
};
