import {
    Page,
    Layout, LegacyCard, LegacyTabs, AlphaCard,
} from "@shopify/polaris";
import {TitleBar} from "@shopify/app-bridge-react";

import {FormInfor, ProductCard,ProductsCard} from "../components";
import React, {useCallback, useState} from "react";
import {useAppQuery} from "../hooks/index.js";
import {CompanyInfor} from "../components/CompanyInfor.jsx";
import {ProductList} from "../components/ProductList.jsx";

export default function HomePage() {
    // Hooks : helps to query better from the backend
    const {data, isLoading, refetch,isRefetching} = useAppQuery({
        url: "/api/products",
    });

    console.log("data: ",data)


    {/* Tab */
    }
    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );

    const tabs = [
        {
            id: 'all-customers-1',
            content: 'All',
            accessibilityLabel: 'All customers',
            panelID: 'all-customers-content-1',
        },
        {
            id: 'accepts-marketing-1',
            content: 'Accepts marketing',
            panelID: 'accepts-marketing-content-1',
        },
        {
            id: 'repeat-customers-1',
            content: 'Repeat customers',
            panelID: 'repeat-customers-content-1',
        },
        {
            id: 'prospects-1',
            content: 'Prospects',
            panelID: 'prospects-content-1',
        },
    ];

    return (
        <Page>
            <TitleBar title="Vify Invoice Generator" primaryAction={null}/>
            <Layout>

            <Layout.Section >

            <FormInfor />
            </Layout.Section>

                <Layout.Section>
                   <ProductList data={data} isLoading={isLoading} isRefetching={isRefetching} />
                </Layout.Section>
                <Layout.Section>


                </Layout.Section>

            </Layout>
        </Page>
    );
}
