// Update the edit page to get Products Data
import {Page, Layout, SkeletonBodyText, LegacyCard} from "@shopify/polaris";
import { Loading, TitleBar } from "@shopify/app-bridge-react";
import {InvoiceForm} from "../../components/form.jsx";
import {useParams} from "react-router-dom";
import {useAppQuery} from "../../hooks/index.js";

export default function ProductEdit() {
    const breadcrumbs = [{ content: "Invoice", url: "/" }];

    const {id} = useParams();
    const {
        data: product,
        isLoading,
        isRefetching,
    } = useAppQuery({
        url: `api/products/${id}`,
        reactQueryOption: {
            /* Disable refetching because the ProductTable component ignores changes to its props*/
            refetchOnReconnect: false
        },
    });


    /* Loading action and markup that uses App Bridge and Polaris components */
    if (isLoading || isRefetching) {
        return (
            <Page>
                <TitleBar
                    title="Edit Invoice"
                    breadcrumbs={breadcrumbs}
                    primaryAction={null}
                />
                <Loading />
                <Layout>
                    <Layout.Section>
                        <LegacyCard sectioned title="Title">
                            <SkeletonBodyText />
                        </LegacyCard>
                        <LegacyCard title="Product">
                            <LegacyCard.Section>
                                <SkeletonBodyText lines={1} />
                            </LegacyCard.Section>
                            <LegacyCard.Section>
                                <SkeletonBodyText lines={3} />
                            </LegacyCard.Section>
                        </LegacyCard>
                        <LegacyCard sectioned title="Discount">
                            <SkeletonBodyText lines={2} />
                        </LegacyCard>
                    </Layout.Section>
                    <Layout.Section secondary>
                        <LegacyCard sectioned title="Invoice" />
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    return (
        <Page>
            <TitleBar
                title="Edit Invoice"
                breadcrumbs={breadcrumbs}
                primaryAction={null}
            />
            <InvoiceForm product ={product} />
        </Page>
    );
}
