import {InvoicesDb} from "../backend/database/invoices-db.js";
import {countries_List} from "../helpers/countriesList.js"

export default function applyInvoiceApiEndpoints(app) {
// Pay attention to this
    app.post("/api/invoices", async (req, res) => {
            console.log('begin..')
            try {
                let status = 200;
                console.log("status of invoice Api", status)
                let customerName
                let data
                let customerCountryLabel
                let companyCountryLabel
                let isInserted
                countries_List.map( p => {
                    if (p.code === req.body.customerCountry) {
                        customerCountryLabel = p.label
                        console.log("customerCountryLabel",customerCountryLabel)
                    }
                })
                countries_List.map( foundCountry => {
                    if (foundCountry.code === req.body.companyCountry) {
                        companyCountryLabel = foundCountry.label
                        console.log("companyCountryLabel",companyCountryLabel)
                    }
                })
                const foundCustomer = InvoicesDb.selectCustomerById(req.body.customer)
                foundCustomer.then(async result => {
                    customerName = result.name
                    data = {
                        companyName: req.body.companyName,
                        companyEmail: req.body.companyEmail,
                        companyCountry: companyCountryLabel,
                        companyCity: req.body.companyCity,
                        companyAddress: req.body.companyAddress,
                        companyZipCode: req.body.companyZipCode,
                        customerId: req.body.customer,
                        customerName: customerName,
                        customerEmail: req.body.customerEmail,
                        customerAddress: req.body.customerAddress,
                        customerCity: req.body.customerCity,
                        customerCountry: customerCountryLabel,
                        customerZipCode: req.body.customerZipCode,
                        subTotal: req.body.subTotal,
                        tax: req.body.tax,
                        total: req.body.total,
                    }

                    console.log("data from body", data)
                     isInserted = await InvoicesDb.insert_Invoice(data)
                    console.log("is Inserted in invoice table", isInserted)
                })
                    console.log("line Item", req.body.lineItem)
                    req.body.lineItem.map(ln => {
                        let foundProduct = InvoicesDb.selectProductById(ln.id)
                        foundProduct.then(result => {
                            console.log("result of found Product", result)
                            let foundVariant = InvoicesDb.selectVariantById(ln.variantId)
                            foundVariant.then(async rel => {
                                if (rel.productId === ln.id) {
                                    let dataForLineItem = {
                                        invoiceId: `${isInserted}`,
                                        productId: ln.id,
                                        productName: result.productTitle,
                                        productDescription: result.productDescription,
                                        variantId: ln.variantId,
                                        price: ln.price,
                                        quantity: ln.quantity,
                                        subTotal: ln.subTotal
                                    }
                                    console.log("Data for Line Item", dataForLineItem)
                                    await InvoicesDb.insertLineItem(dataForLineItem)
                                }

                            })
                        })
                    })
                    res.status(status).send({message: "Good job"});
            } catch (e) {
                console.log("wrong with this invoice api", e)
            }
        }
    )
    app.post("/api/readInvoices", async (req, res) => {
        try {
            let status = 200
            console.log("Status", status)
            const invoice = await InvoicesDb.selectLastInvoice()
            console.log(" invoice Data ", invoice)
            let arrayResult = []
            arrayResult.push(invoice)
            console.log("Data from api Invoice", arrayResult)
            res.status(status).send(arrayResult)
            // })

        } catch (e) {
            console.log(e)
        }
    })
    app.post("/api/readLineItems", async (req, res) => {
        try {
            let status = 200
            console.log("Status", status)
            const relatedLineItems = await InvoicesDb.selectLastLineItems()
            console.log("all Line Items", relatedLineItems)
            res.status(status).send(relatedLineItems)
        } catch (e) {
            console.log(e)
        }
    })

}
