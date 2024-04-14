"use strict";

import { Config } from "../config";
import express, { Request } from "express";
import { IAppContext } from "../types/app";
import cors from "cors";
import { json } from "body-parser";
import cookieParser from "cookie-parser"
import multer from 'multer'
import initDb from "../models";
import initServices from "../services";
import log from "../utils/log";
import router from "../routes";
import setContext from "../middlewares/context";
import Driver from "../models/user/driver";
import { createServer } from "http";
import initWebsocket from "../utils/web-sockets";
import path from "path";

export const appContext: IAppContext = {};
export let app;

export default async function start(config: Config) {
  try {
    // initialize models
    appContext.models = await initDb(config.db)
    appContext.services = await initServices(appContext)
    
    // initialize app
    app = express();
    app.use(express.urlencoded({ extended: true }));

    // initialize web sockets
    const server = createServer(app)
    await initWebsocket(server)

         // cors and json middleware
         app.use(
          cors<cors.CorsRequest>(),
          json(),
        );

        // cookie middleware
        app.use(cookieParser())

    //server health check
    app.use("/healthcheck", (_, res) => {
      res.status(200).send("All is green!!!");
    });

    //clear database
    app.get('/clearDB',async (_,res) => {
      await Driver.deleteMany()
      res.status(200).send('database cleared')
    })

    //router
    app.use(router)

    // serve some test htmlm files
    app.use(express.static(path.join(__dirname,"..","public")))
    app.get("/websocket", (_,res) => {
      res.sendFile(path.join(__dirname,"..","public","websocket.html"))
    })

    // start app
    server.listen(config.app.port, () => {
      log.info(
        `Server ready at http://localhost:${config.app.port}`
      );
    }); 
  } catch (err) {
    console.error(err);
  }
}