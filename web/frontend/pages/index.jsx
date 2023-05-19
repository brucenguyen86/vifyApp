import {
    Page,
    Layout, LegacyCard, LegacyTabs,
} from "@shopify/polaris";
import {TitleBar} from "@shopify/app-bridge-react";

import { FormInfor, ProductsCard} from "../components";
import React, {useCallback, useState} from "react";

export default function HomePage() {
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
            <LegacyCard>
                <LegacyTabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                    <LegacyCard.Section title={tabs[selected].content}>
                        <p>Tab {selected} selected</p>
                    </LegacyCard.Section>
                </LegacyTabs>
            </LegacyCard>
            <hr/>
            <FormInfor />
        </Page>
    );
}
