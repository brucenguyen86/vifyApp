import React, {Fragment, useCallback, useEffect, useState} from "react";
import {Button, Layout, LegacyCard, Page} from "@shopify/polaris";
import {TitleBar, useAuthenticatedFetch} from "@shopify/app-bridge-react";
import DateTime from "../../components/DateTime.jsx";

export default function printInvoice(){
    const breadcrumbs = [{content: "Home", url: "/"}];
    const fetch = useAuthenticatedFetch()
    const [data,setData] = useState([])
    const [invoiceData, setInvoiceData] = useState([])
    const [lineItemData,setLineItemData] = useState([])
    console.log("done")

    useEffect( async () => {
        // console.log("data", data)

        await fetch('/api/readInvoices', {
            method: "POST",
            body: '',
            headers: {"Content-Type": "application/json"},
        }).then(result => result.json()).then(value => {
                console.log("Invoice data after calling API", value)
                setInvoiceData(value)
                // console.log("All Data ",data)
            }
        )
        await fetch('/api/readLineItems', {
            method: "POST",
            body: '',
            headers: {"Content-Type": "application/json"},
        }).then(result => result.json()).then(value => {
                console.log("Line Items Data ", value)
                setLineItemData(value)
                // console.log("All Data ",data)

            }
        )
    },[])

    return(
        <Page>
            <TitleBar
                title="Printing Your Invoice"
                breadcrumbs={breadcrumbs}
                primaryAction={null}
            />
            <Layout>

                <LegacyCard sectioned={true}>
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        <strong>Invoice: </strong>
                        <strong> <p> <DateTime></DateTime></p></strong>
                        <span className="float-right"> <strong>Status:  </strong>Pending</span>

                    </div>
                    <div className="card-body">

                        <div className="row mb-4">
                            <div className="col-sm-6">

                                    <h6 className="mb-3">From:</h6>
                               <div>
                                {invoiceData.map((inv,index) =>(
                                <li key={index}>
                                    <ul><strong>{inv.companyName}</strong></ul>
                                    <ul>{inv.companyEmail}</ul>
                                    <ul>{inv.companyAddress}</ul>
                                    <ul>{inv.companyCity}</ul>
                                    <ul>{inv.companyZipCode}</ul>
                                    <ul>{inv.companyCountry}</ul>
                                </li>
                                ))}
                               </div>
                            </div>


                            <div className="col-sm-6">
                                <h6 className="mb-3">To:</h6>
                                <div>
                                    {invoiceData.map((inv,index) =>(
                                        <li key={index}>
                                            <ul><strong>{inv.customerName}</strong></ul>
                                            <ul>{inv.customerEmail}</ul>
                                            <ul>{inv.customerAddress}</ul>
                                            <ul>{inv.customerCity}</ul>
                                            <ul>{inv.customerZipCode}</ul>
                                            <ul>{inv.customerCountry}</ul>
                                        </li>
                                    ))}
                                </div>
                            </div>


                        </div>

                        <div className="table-responsive-sm">
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                    <th className="center">#</th>
                                    <th>Item</th>
                                    <th>Description</th>

                                    <th className="right">Unit Cost</th>
                                    <th className="center">Qty</th>
                                    <th className="right">Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {lineItemData.map((lineItem, idx) => (
                                    <tr key={idx}>
                                        <td className="center">1</td>
                                        <td className="left strong">{lineItem.productName}</td>
                                        <td className="left">{lineItem.productDescription}</td>

                                        <td className="right">{lineItem.price}</td>
                                        <td className="center">{lineItem.quantity}</td>
                                        <td className="right">{lineItem.subTotal}</td>
                                    </tr>
                                ))}


                                </tbody>
                            </table>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-sm-5">
                            </div>
                            <div className="col-lg-4 col-sm-5 ml-auto">
                                <table className="table table-clear">
                                    <tbody>
                                    {invoiceData.map((inv,idx) => (
                                        <Fragment key={idx}>
                                    <tr>
                                        <td className="left">
                                            <strong>Subtotal</strong>
                                        </td>
                                        <td className="right">${inv.subTotal}</td>
                                    </tr>
                                    <tr>
                                        <td className="left">
                                            <strong>TAX</strong>
                                        </td>
                                        <td className="right">%{inv.tax}</td>
                                    </tr>

                                    <tr>
                                        <td className="left">
                                            <strong>Total</strong>
                                        </td>
                                        <td className="right">
                                            <strong>${inv.total}</strong>
                                        </td>
                                    </tr>
                                        </Fragment>
                                        ))}
                                    </tbody>
                                </table>

                            </div>

                        </div>

                    </div>
                </div>
            </div>

                </LegacyCard>

            </Layout>
        </Page>
    )

}