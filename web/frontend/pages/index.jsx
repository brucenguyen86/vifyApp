import {
    Page, Layout, AlphaCard, Form, Button,
} from "@shopify/polaris";
import {TitleBar} from "@shopify/app-bridge-react";

import {
    Billing,
    CompanyInfor,
    CustomerInvoice,
    FormInfor,
    ProductsCard,
    ProductSelector,
    ProductList
} from "../components";
import React, {useCallback, useState} from "react";
import {useAppQuery} from "../hooks/index.js";


export default function HomePage() {
    // Hooks : helps to query better from the backend
    const {data, isLoading, refetch, isRefetching} = useAppQuery({
        url: "/api/products",
    });

    console.log("data: ", data)

    //fetch Customers
    // const {data, isLoading,refetch, isRefetching} = useAppQuery({
    //     url: "/api/customers",
    // });
    //
    // console.log("dataCustomer", data)


// Handle Submit
    const [newsletter, setNewsletter] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = useCallback(() => {

        },
        []);


    return (<Page>
            <TitleBar title="Vify Invoice Generator" primaryAction={null}/>
            <Layout>
                <Layout.Section>
                    <AlphaCard padding={"2"} background={"bg-subdued"}>
                        <Form onSubmit={handleSubmit}>
                            <CompanyInfor/>
                            <CustomerInvoice/>

                            <Button>Submit</Button>
                        </Form>
                    </AlphaCard>
                </Layout.Section>
                <Layout.Section>
                    {/*<Billing data={data}/>*/}
                </Layout.Section>
                <Layout.Section>
                    <ProductsCard/>
                </Layout.Section>
                <Layout.Section>
                    <ProductList data={data} isLoading={isLoading} isRefetching={isRefetching}/>

                </Layout.Section>
                <Layout.Section>
                    <ProductSelector data={data} isLoading={isLoading} isRefetching={isRefetching}/>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

