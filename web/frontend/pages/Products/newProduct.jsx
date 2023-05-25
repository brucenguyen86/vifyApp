import { Page} from "@shopify/polaris";
import {TitleBar} from "@shopify/app-bridge-react";
import { InvoiceForm} from "../../components/form.jsx";

export default function NewProduct() {
    const breadcrumbs = [{content: "Product Creator", url: "/"}];

    return (
        <Page>
            <TitleBar title={"Create Your Product"}
            breadcrumbs={breadcrumbs}
                      primaryAction={null}
            >
                <InvoiceForm />
            </TitleBar>
        </Page>
    )
}