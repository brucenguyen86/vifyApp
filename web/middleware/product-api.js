/*
  The custom REST API to support the app frontend.
  Handlers combine application data from qr-codes-db.js with helpers to merge the Shopify GraphQL Admin API data.
  The Shop is the Shop that the current user belongs to. For example, the shop that is using the app.
  This information is retrieved from the Authorization header, which is decoded from the request.
  The authorization header is added by App Bridge in the frontend code.
*/

import express from "express";

import shopify from "../shopify.js";
import { InvoicesDb } from "../backend/database/invoices-db.js";
import fetchProducts, {
} from "../helpers/products.js";
import productCreator from "../helpers/product_creator.js";


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
    // app.use(express.json());

app.get("/api/shop-data",async (req,res) => {
    const client = new shopify.api.clients.Graphql({
        session: res.locals.shopify.session,
    })
    // Fetch shop data
    const shopData = await client.query({
        data: {
            query: SHOP_DATA_QUERY,
            variables: {
                first: 25,
            }
        }
    })
    console.log(shopData.body.data.session.id)
    res.send(shopData.body.data)
})

// Pay attention to this
    app.get("/api/products", async (req, res) => {
            try {
                let status = 200;
                const products = await fetchProducts(res.locals.shopify.session);
                // console.log("done with products data /n",products)
                products.map( async (product) => {
                    let data = {
                        productId: product.id,
                        productTitle: product.title,
                        productDescription : product.description,
                    }
                    product.variants.map( async variant => {
                        let dataVariant={
                            productId: product.id,
                            variantId: variant.id,
                            variantTitle: variant.title,
                            price: variant.price,
                        }
                        let isInsertedToVariantTable = await InvoicesDb.insertVariants(dataVariant)
                        console.log("Is inserted to Variant Table",isInsertedToVariantTable)
                    })

                    const isInserted = await InvoicesDb.insert(data)
                    console.log("is Inserted", isInserted)
                })
                res.status(status).send({products});
        } catch (e){
            console.log(e)
        }
    }


    )



app.get("/api/productsFromDB", async (req, res) => {
        try {
            let status = 200;
            // const products = await fetchProducts(res.locals.shopify.session);
            // console.log("done with products data /n",products)
            const productList = InvoicesDb.selectAllProducts()
            productList.then(result => res.status(status).send(result))

        } catch (e){
            console.log(e)
        }
    }
)
    app.get("/api/variantsFromDB", async (req, res) => {
            try {
                let status = 200;
                // const products = await fetchProducts(res.locals.shopify.session);
                // console.log("done with products data /n",products)
                const variantList = InvoicesDb.selectAllVariants()
                variantList.then(result => res.status(status).send(result))

            } catch (e){
                console.log(e)
            }
        }
    )

    app.post("/api/addNewLineItem", async (req, res) => {
        let status = 200;
        let error = null
        try {
               const addNewLineItem= await productCreator(req, res.locals.shopify.session)
                console.log("done with add new Line Item",addNewLineItem)
            } catch (e){
                // console.log(e)
                console.log(`Failed to process products/create: ${e.message}`);
                status = 500;
                error = e.message;
            }
        res.status(status).send({ success: status === 200, error });

        }
    )


}
    //
    // app.get("/api/products/:id", async (req, res) => {
    //     const product = await getProductOr404(req, res);
    //
    //     if (product) {
    //         const formattedProduct = await formatProductResponse(req, res, [qrcode]);
    //         res.status(200).send(formattedProduct[0]);
    //     }
    // });
    //
    // app.delete("/api/products/:id", async (req, res) => {
    //     const product = await getProductOr404(req, res);
    //
    //     if (product) {
    //         await ProductsDB.delete(req.params.id);
    //         res.status(200).send();
    //     }
    // });
