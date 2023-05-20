import React, {useCallback, useState} from "react";
import {
    FormLayout, LegacyCard, ResourceList, LegacyStack, TextField, Select,

} from "@shopify/polaris";
import TextareaAutosize from "@mui/base/TextareaAutosize";


export function Billing() {
    {/* Quanity */
    }
    const [quantityValue, setQuantityValue] = useState('1.00');

    const handleQuantityChange = useCallback(
        (value) => setQuantityValue(value),
        [],
    );
    {/* Price */
    }
    const [priceValue, setPriceValue] = useState('2.00');

    const handlePriceChange = useCallback(
        (value) => setPriceValue(value),
        [],
    );

    {/* Select */
    }

    const [selected, setSelected] = useState('today');

    const handleSelectChange = useCallback(
        (value) => setSelected(value),
        [],
    );

    const options = [
        {label: 'Today', value: 'today'},
        {label: 'Yesterday', value: 'yesterday'},
        {label: 'Last 7 days', value: 'lastWeek'},
    ];

    return (
        <FormLayout>
            <FormLayout.Group>
                PRODUCT LIST:

            </FormLayout.Group>

            <FormLayout.Group condensed ={true}>
                <Select
                    label="Country"
                    options={options}
                    onChange={handleSelectChange}
                    value={selected}
                />
                <TextField
                    label="Description"
                    onChange={() => {}}
                    autoComplete="off"/>
                <TextField
                    label="Quantity"
                    type="number"
                    value={quantityValue}
                    onChange={handleQuantityChange}
                    autoComplete="off"
                />
                <TextField
                    label="Price"
                    type="number"
                    value={priceValue}
                    onChange={handlePriceChange}
                    prefix="$"
                    autoComplete="off"
                />

            </FormLayout.Group>

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
        </FormLayout>
    )
}