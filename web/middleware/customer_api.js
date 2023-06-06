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
import productCreator from "../helpers/product_creator.js";
import customerCreator from "./customer_creator.js";
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

    app.get("/api/customersFromDB", async (req, res) => {
            try {
                let status = 200;
                // const products = await fetchProducts(res.locals.shopify.session);
                // console.log("done with products data /n",products)
                const customerList = InvoicesDb.selectAllCustomers()
                customerList.then(result => res.status(status).send(result) )

            } catch (e){
                console.log(e)
            }
        }
    )

    app.post("/api/addNewCustomer", async (req, res) => {
            let status = 200;
            let error = null
            try {
                const addNewCustomer= await customerCreator(req, res.locals.shopify.session)

                console.log("done with add new Customer",addNewCustomer)

            } catch (e){
                console.log(`Failed to process products/create: ${e.message}`);
                status = 500;
                error = e.message;
            }
            res.status(status).send({ success: status === 200, error });

        }
    )

}
