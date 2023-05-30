import {
    Page,
    Layout,
    AlphaCard,
    Form,
    Button,
    HorizontalStack,
    Text,
    FormLayout,
    TextField,
    Select,
    DropZone,
    LegacyCard,
    LegacyTabs,
} from "@shopify/polaris";
import {TitleBar, useAuthenticatedFetch, useNavigate} from "@shopify/app-bridge-react";

import {
    CompanyInfor,
    CustomerInvoice,
    ProductsCard,
} from "../components";
import React, {useCallback, useState} from "react";
import {useAppQuery} from "../hooks/index.js";


export default function HomePage() {
    // Hooks : helps to query better from the backend
    // const {data, isLoading, refetch, isRefetching} = useAppQuery({
    //     url: "/api/customers",
    //  });
    // console.log("data: d",data)
    const navigate = useNavigate()
//     const fetch = useAuthenticatedFetch()
// //
//     Promise.all([
//         fetch("/api/products").then(value => value.json()),
//         fetch("api/customers").then(value => value.json())
//     ]).then((allResponse) => {
//         const response1 = allResponse[0]
//         const response2 = allResponse[1]
//         // response1.then(r => console.log("come here",r))
//         console.log("response1",response1)
//         console.log("response2",response2)
//         // console.log("response2",response2[0].id)
//     })

// //
//     const url = "/api/customers";
// //     /* a condition to select the appropriate HTTP method: PATCH to update a QR code or POST to insert a new QR code */
//     const method = "GET";
// //     /* use (authenticated) fetch from App Bridge to send the request to the API and, if successful, clear the form to reset the ContextualSaveBar and parse the response JSON */
    // const getCustomers = async () =>{
    //     const data = {
    //         id:
    //         firstName:
    //     lastName:
    //     }
    //     const response = await fetch(url, {
    //         method: "GET",
    //         body: JSON.stringify(parseData),
    //         headers: {"Content-Type": "application/json"},
    //     });

    //
    // }

    //fetch Customers
    // const {data, isLoading,refetch, isRefetching} = useAppQuery({
    //     url: "/api/customers",
    // });
    //
    // console.log("dataCustomer", data)
    //CompanyInfor
    // CompanyInfor ended

// // Legacy Tab
//     const [selected, setSelected] = useState(0);
//
//     const handleTabChange = useCallback(
//         (selectedTabIndex) => {
//             // navigate("/invoices/new")
//             setSelected(selectedTabIndex)
//         },
//         [],
//     );
//     // Legacy Tab ended

    const handleSubmit = useCallback(() => {
        },
        []);

    const breadcrumbs = [{ content: "Home", url: "/" }];

    return (<Page>
            <TitleBar title="Invoice Generator"
                      primaryAction={
                            {
                                content:"Generate Invoice",
                                onAction: () => navigate("/invoices/new")
                                }
                            }
                      breadcrumbs={breadcrumbs}
            />
            <Layout>
                <Layout.Section>
                    <CompanyInfor/>

                </Layout.Section>
                <Layout.Section secondary={true}>
                    <LegacyCard sectioned={true} title="Something">
                            <Button>CLick here</Button>
                    </LegacyCard>
                </Layout.Section>


            </Layout>
        </Page>
    );
}
