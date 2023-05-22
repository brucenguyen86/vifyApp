import React, {useCallback, useState} from "react";
import {
    FormLayout, LegacyCard, ResourceList, LegacyStack, TextField, Select, Layout, Spinner,

} from "@shopify/polaris";
import TextareaAutosize from "@mui/base/TextareaAutosize";


export function Billing({data}) {
    {/* Quanity */
    }
    const [quantityValue, setQuantityValue] = useState('1.00');

    const handleQuantityChange = useCallback(
        (value) => setQuantityValue(value),
        [],
    );
    {/* Tax */
    }
    const [taxValue, setTaxValue] = useState('13');

    const handleTaxValue = useCallback(
        (value) => setTaxValue(value),
        [],
    );


    {/* Select */
    }

    const [selected, setSelected] = useState('Default');

    const handleSelectChange = useCallback(
        (value) => setSelected(value),
        [],
    );

    const options= []
    data.products.map(product => {
        const temp = {label: product.title,value: product.id }
        options.push(temp);
    })

const handleDescription = useCallback((selected) =>
        data.products.map( product =>  {
        if (product.id === selected) return product.description
            }),
            [],
        )
    const handlePrice = useCallback((selected) =>
            data.products.map( product =>  {
                if (product.id === selected) return product.variants[0].price
            }),
        [],
    )

    const handleSubTotal = useCallback((selected,qualityValue) =>
            data.products.map( product =>  {
                if (product.id === selected) return product.variants[0].price * qualityValue
            }),
        [],
    )

    const handleTotal = useCallback((selected,taxValue,quantityValue) =>
            data.products.map( product =>  {
                if (product.id === selected) return taxValue * handleSubTotal(selected,quantityValue)
            }),
        [],
    )

    // if (isLoading || isRefetching) {
    //     return (
    //         <Layout>
    //             <Spinner/>
    //         </Layout>
    //     );
    // }

    return (
        <FormLayout>
            <FormLayout.Group>
                PRODUCT LIST:

            </FormLayout.Group>

            <FormLayout.Group condensed ={true}>
                <Select
                    label="Product"
                    options={options}
                    onChange={handleSelectChange}
                    value={selected}

                />
                <TextField
                    label="Description"
                    autoComplete="off"
                    value = {handleDescription(selected)}

                />
                <TextField
                    label="Quantity"
                    type="number"
                    value={quantityValue}
                    onChange={handleQuantityChange}
                    autoComplete="off"
                />
                <TextField
                    label="Price"
                    value={handlePrice(selected)}
                    prefix="$"
                    autoComplete="off"
                />


            </FormLayout.Group>

            <FormLayout.Group condensed={true}>
                <TextareaAutosize placeholder={"Write down some notes here"}> </TextareaAutosize>

                <LegacyCard>

                    <LegacyCard.Section title="Your Bill">
                        <TextField
                            label="Subtotal"
                            value={handleSubTotal(selected,quantityValue)}
                            prefix="$"
                            autoComplete="off"
                        />
                        <TextField
                            label="Tax"
                            type="number"
                            prefix="%"
                            value={taxValue}
                            onChange={handleTaxValue}
                            autoComplete="off"
                        />
                        <TextField
                            label="Total"
                            type="number"
                            prefix="$"
                            value={handleTotal(selected,taxValue,quantityValue)}
                            autoComplete="off"
                        />

                    </LegacyCard.Section>
                </LegacyCard>

            </FormLayout.Group>
        </FormLayout>
    )
}