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
import fetchCustomers from "../helpers/customers.js";
export default function applyCustomerApiEndpoints(app) {
// Pay attention to this
    app.get("/api/customers", async (req, res) => {
            try {
                let status = 200;
                const customers = await fetchCustomers(res.locals.shopify.session);
                // console.log("done with customers data /n",customers)
                // let test = {}
                // test = InvoicesDb.selectCustomerById('gid://shopify/Customer/6938223378733')
                // test.then(r => console.log("Test",r))
                customers.map(async (customer) => {
                    let data = {
                        customerId: customer.customerId,
                        name: customer.name,
                        email: customer.email,
                    }
                    // console.log("data from customers", data)
                const isInserted = await InvoicesDb.insert_Customer(data)
                    console.log("is Inserted in customer table", isInserted)

                })
                res.status(status).send({customers});
            } catch (e){
                console.log(e)
            }
        }

    )

}
