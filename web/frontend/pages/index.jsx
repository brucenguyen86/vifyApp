import {
    Page, Layout,  LegacyCard, SkeletonBodyText, EmptyState,
} from "@shopify/polaris";
import {Loading, TitleBar} from "@shopify/app-bridge-react";

import React, {useCallback, useState} from "react";

import {InvoiceIndex} from "../components";
import {navigate} from "jsdom/lib/jsdom/living/window/navigation.js";
import {useAppQuery} from "../hooks/index.js";


export default function HomePage() {


    const {
        data: products,
        isLoading,
        isRefetching,
    } = useAppQuery({
        url: "/api/products",
    });


    // Set the products to use in the list
const productMarkup = products?.length ? (
    <InvoiceIndex products = {products } loading={isRefetching}/>
) : null;
    /* loadingMarkup uses the loading component from AppBridge and components from Polaris*/
    const loadingMarkup = isLoading ? (
        <LegacyCard sectioned={true}>
            <Loading />
            <SkeletonBodyText />
        </LegacyCard>
    ): null;
    /* Use Polaris card and EmptyState componets to define the contents of the empty state*/
    const emptyStateMarkup =
        !isLoading && !products?.length ? (
            <LegacyCard sectioned={true}>
                <EmptyState image={"https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"}
                heading = "Create an Invoice for your Order"
                            action={{
                                content: "Create your Invoice",
                                onAction: () => navigate("/products/new"),
                                }
                            }
                >
                    <p> Create your Invoice</p>

                </EmptyState>
            </LegacyCard>
        ) : null;


    return (<Page>
            <TitleBar title="Vify Invoice Generator"
                      primaryAction={{
                          content: "Create Invoice",
                          onAction: () => navigate("/products/new"),
                          }
                      }
            />
            <Layout>
                <Layout.Section>
                    {loadingMarkup}
                    {productMarkup}
                    {emptyStateMarkup}
                </Layout.Section>
            </Layout>
        </Page>
    );
}

