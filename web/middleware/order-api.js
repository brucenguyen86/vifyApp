/*
  The custom REST API to support the app frontend.
  Handlers combine application data from qr-codes-db.js with helpers to merge the Shopify GraphQL Admin API data.
  The Shop is the Shop that the current user belongs to. For example, the shop that is using the app.
  This information is retrieved from the Authorization header, which is decoded from the request.
  The authorization header is added by App Bridge in the frontend code.
*/

import express from "express";

import shopify from "../shopify.js";
import { OrdersDB } from "../backend/database/Orders_db.js";
import fetchOrders, {
} from "../helpers/orders.js";


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
export default function applyOrderApiEndpoints(app) {
    // app.use(express.json());
// Pay attention to this
    app.get("/api/orders", async (req, res) => {
            try {
                let status = 200;
                const orders = await fetchOrders(res.locals.shopify.session);
                // console.log("done",orders)
                // orders.map(order => {

                    // const isFound = OrdersDB.findOrderById(order.id)
                    // isFound.then(result => {
                    //     console.log("isFound: ", result)
                    //     if (isFound === false) {
                    //         console.log("result is undefined -> next")
                    //         let data = {
                    //             orderId : order.id,
                    //             orderName: order.title,
                    //             customerId : order.customer.id,
                    //             customerFirstName : order.customer.first_name,
                    //             customerLastName: order.customer.last_name,
                    //             shippingAddress: order.shippingAddress,
                    //             products: order.line_items,
                    //             tax: order.total_tax,
                    //             discount: order.total_discounts,
                    //             subTotal: order.subTotal,
                    //             total: order.total_price,
                    //         }
                    //         console.log(data)
                            // const rawResult = ProductsDB.insert(data);
                            // rawResult.then((result) => console.log(result))

                    //     }
                    // })
                //
                // })
                res.status(status).send({orders});
            } catch (e){
                console.log(e)
            }
        }

    )

}
