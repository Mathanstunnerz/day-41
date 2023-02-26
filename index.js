import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import { MongoClient } from "mongodb";
import routerdata from "./router/app.js";
import express from "express";
// const MONGO_URL = "mongodb://127.0.0.1";
const MONGO_URL = process.env.MONGO_URL 
export const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");
// http://localhost:4000
const app = express();
app.use(routerdata);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log("SERVER CONNECTED: " + PORT));
