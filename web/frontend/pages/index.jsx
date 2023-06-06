import {
    Page,
    Layout,
    LegacyCard,
} from "@shopify/polaris";
import {TitleBar, useNavigate} from "@shopify/app-bridge-react";
import React from "react";
import {ProductsCard} from "../components/index.js";


export default function HomePage() {
    const navigate = useNavigate()

    const breadcrumbs = [{content: "Home", url: "/"}];

    return (<Page>
            <TitleBar title="Invoice Generator"
                      primaryAction={
                          {
                              content: "Generate Invoice",
                              onAction: () => navigate("/invoices/newInvoice")
                          }
                      }
                      breadcrumbs={breadcrumbs}
            />
            <Layout>
                <Layout.Section>
                    <LegacyCard sectioned={true} title={"Vify Company"}>
                        <h2>Thank you for using our app</h2>
                        <br/>
                        <h2>Please contact us if you have any questions</h2>
                    </LegacyCard>
                </Layout.Section>
                <Layout.Section secondary={true}>
                    <ProductsCard/>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
