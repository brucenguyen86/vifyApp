/*
  The custom REST API to support the app frontend.
  Handlers combine application data from qr-codes-db.js with helpers to merge the Shopify GraphQL Admin API data.
  The Shop is the Shop that the current user belongs to. For example, the shop that is using the app.
  This information is retrieved from the Authorization header, which is decoded from the request.
  The authorization header is added by App Bridge in the frontend code.
*/

import express from "express";

import shopify from "../shopify.js";
import { ProductsDB } from "../products-db.js";
import {
    getProductOr404,
    getShopUrlFromSession,
    parseProductBody,
    formatProductResponse,
} from "../helpers/products.js";

const SHOP_DATA_QUERY = `
  query shopData($first: Int!) {
    shop {
      url
    }
    codeDiscountNodes(first: $first) {
      edges {
        node {
          id
          codeDiscount {
            ... on DiscountCodeBasic {
              codes(first: 1) {
                edges {
                  node {
                    code
                  }
                }
              }
            }
            ... on DiscountCodeBxgy {
              codes(first: 1) {
                edges {
                  node {
                    code
                  }
                }
              }
            }
            ... on DiscountCodeFreeShipping {
              codes(first: 1) {
                edges {
                  node {
                    code
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default function applyProductApiEndpoints(app) {
    app.use(express.json());

    app.get("/api/shop-data", async (req, res) => {
        const client = new shopify.api.clients.Graphql({
            session: res.locals.shopify.session,
        });

        /* Fetch shop data*/
        const shopData = await client.query({
            data: {
                query: SHOP_DATA_QUERY,
                variables: {
                    first: 25,
                },
            },
        });

        res.send(shopData.body.data);
    });
// Pay attention to this
    app.post("/api/products", async (req, res) => {
        try {
            const id = await ProductsDB.create({
                ...(await parseProductBody(req)),

                /* Get the shop from the authorization header to prevent users from spoofing the data */
                shopDomain: await getShopUrlFromSession(req, res),
            });
            const response = await formatProductResponse(req, res, [
                await ProductsDB.read(id),
            ]);
            res.status(201).send(response[0]);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    app.patch("/api/products/:id", async (req, res) => {
        const product = await getProductOr404(req, res);

        if (product) {
            try {
                await ProductsDB.update(req.params.id, await parseProductBody(req));
                const response = await formatProductResponse(req, res, [
                    await ProductsDB.read(req.params.id),
                ]);
                res.status(200).send(response[0]);
            } catch (error) {
                res.status(500).send(error.message);
            }
        }
    });

    app.get("/api/products", async (req, res) => {
        try {
            const rawCodeData = await ProductsDB.list(
                await getShopUrlFromSession(req, res)
            );

            const response = await formatProductResponse(req, res, rawCodeData);
            res.status(200).send(response);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    });

    app.get("/api/products/:id", async (req, res) => {
        const product = await getProductOr404(req, res);

        if (product) {
            const formattedProduct = await formatProductResponse(req, res, [qrcode]);
            res.status(200).send(formattedProduct[0]);
        }
    });

    app.delete("/api/products/:id", async (req, res) => {
        const product = await getProductOr404(req, res);

        if (product) {
            await ProductsDB.delete(req.params.id);
            res.status(200).send();
        }
    });
}
