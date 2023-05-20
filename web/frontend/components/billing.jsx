import React, {useCallback, useState} from "react";
import {
    FormLayout, LegacyCard, ResourceList, LegacyStack,

} from "@shopify/polaris";
import TextareaAutosize from "@mui/base/TextareaAutosize";

export function Billing(){
    return (
        <FormLayout.Group condensed={true}>
            <TextareaAutosize placeholder={"Write down some notes here"}> </TextareaAutosize>

            <LegacyCard>
                <LegacyCard.Section title="Your Bill">
                    <ResourceList
                        resourceName={{singular: 'sale', plural: 'sales'}}
                        items={[
                            {
                                sales: 'SUBTOTAL',
                                amount: 'USD$0.00',
                                url: '#',
                            },
                            {
                                sales: 'TAX',
                                amount: '13%',
                                url: '#',
                            },
                        ]}
                        renderItem={(item) => {
                            const {sales, amount, url} = item;
                            return (
                                <ResourceList.Item
                                    id={item.sales.toLocaleLowerCase()}
                                    url={url}
                                    accessibilityLabel={`View Sales for ${sales}`}
                                >
                                    <LegacyStack>
                                        <LegacyStack.Item fill>{sales}</LegacyStack.Item>
                                        <LegacyStack.Item>{amount}</LegacyStack.Item>
                                    </LegacyStack>
                                </ResourceList.Item>
                            );
                        }}
                    />
                </LegacyCard.Section>
            </LegacyCard>
        </FormLayout.Group>
    )
}