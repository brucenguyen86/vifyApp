// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import GDPRWebhookHandlers from "./gdpr.js";
// import applyProductApiEndpoints from "./middleware/product-api.js";
import applyOrderApiEndpoints from "./middleware/order-api.js";
import applyProductApiEndpoints from "./middleware/product-api.js";
import applyCustomerApiEndpoints from "./middleware/customer_api.js";
import applyInvoiceApiEndpoints from "./middleware/invoice_api.js";


const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// All endpoints after this will require an active session

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

// New codes from me :
applyProductApiEndpoints(app);
applyOrderApiEndpoints(app);
applyInvoiceApiEndpoints(app);
// fetch Customers
applyCustomerApiEndpoints(app)

app.use(serveStatic(STATIC_PATH,{index:false}));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

// @ts-check

app.listen(PORT);
