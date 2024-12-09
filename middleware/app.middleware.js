import express from 'express';
import httpContext from 'express-http-context';
import {LoggerLib} from "../libs/Logger.lib.js";
import { v4 as uuidv4 } from 'uuid';
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const app = express(),
    router =  express.Router()

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: '*'
}));

app.use(httpContext.middleware)
app.use((req, res, next) => {
    httpContext.set('request-id', uuidv4().toString());
    LoggerLib.log('API Request:', {
        url: req.url, method: req.method, request: req.body
    });
    next()
})

export  { app, router };