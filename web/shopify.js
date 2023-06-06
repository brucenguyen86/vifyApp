import { BillingInterval, LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
let { restResources } = await import(
    `@shopify/shopify-api/rest/admin/${LATEST_API_VERSION}`
    );
// New codes from me
import sqlite3 from "sqlite3";
import {join} from "path";
import {OrdersDB} from "./backend/database/Orders_db.js";
import {InvoicesDb} from "./backend/database/invoices-db.js";

//
const database = new sqlite3.Database(join(process.cwd(), "database.sqlite"));
const sessionDb = new SQLiteSessionStorage(database);
// Initialize SQLite DB
InvoicesDb.db = database;
InvoicesDb.init().then(r => console.log("Invoice Database connected"));
// const database_order = new sqlite3.Database(join(process.cwd(), "database.sqlite"));
// const sessionDb_order = new SQLiteSessionStorage(database_order);
// OrdersDB.db = database_order;
// OrdersDB.init().then(r => console.log("Order Database connected"))

const shopify = shopifyApp({
  api: {
    restResources,
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  sessionStorage: sessionDb
});

export default shopify;
