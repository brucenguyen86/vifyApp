import { InvoicesDb } from "../backend/database/invoices-db.js";
import fetchCustomers from "../helpers/customers.js";
import fetchProducts from "../helpers/products.js";
export default function applyInvoiceApiEndpoints(app) {
// Pay attention to this
    app.get("/api/invoices", async (req, res) => {
            try {


                let status = 200;
                    let data = {
                        productId: req.productId,
                        productName: req.productTitle,
                        productDescription: req.productDescription,
                        productPrice: req.price,
                        companyName: req.companyName,
                        companyEmail: req.companyEmail,
                        companyCountry: req.companyCountry,
                        companyCity: req.companyCity,
                        companyAddress: req.companyAddress,
                        customerId: req.customerId,
                        customerName: req.customerName,
                        customerEmail: req.customerEmail,
                        customerAddress: req.customerAddress,
                        customerCity: req.customerCity,
                        customerCountry: req.customerCountry,
                        quantity: req.quantity,
                        subtotal: req.subtotal,
                        total: req.total,
                    }
                    // console.log("data from customers", data)
                    const isInserted = await InvoicesDb.insert_Invoice(data)
                    // console.log("is Inserted in customer table", isInserted)


                res.status(status).send({message:"Good job"});
            } catch (e){
                console.log(e)
            }
        }

    )

}
