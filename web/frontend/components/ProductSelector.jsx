import {Button, Layout, LegacyCard, Spinner, TextField} from "@shopify/polaris";
import React, {useCallback, useState} from "react";
import {ResourcePicker} from "@shopify/app-bridge-react";
import {ProductCard} from "./ProductCard.jsx";



export const ProductSelector = ({data, isLoading, isRefetching}) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("Product");
    const array= []
    let string

// Another resources picker :
    const printProductCard = (products,id) =>
        products.filter(product => product.id === id)
            .map(product => <ProductCard {...product} ></ProductCard> );

    if (isLoading || isRefetching) {
        return (
            <Layout>
                <Spinner/>
            </Layout>
        );
    }
    return (

        <LegacyCard
            title="Product Selector"
            sectioned
            primaryFooterAction={{
                content: "Select Products",
                onAction: () => setOpen(prevState => !prevState)
                }
            }
        >
            <ResourcePicker
                resourceType='Product'
                open = {open}
                onCancel={setOpen}
                onSelection={selectPayload => {
                    const selection = selectPayload.selection;
                    // Do something with `selection`
                    console.log(`The value of Selection : ${selection}`);
                    selection.map(selected => array.push(selected.id));
                    array.map(arr => {
                            console.log(`the value of array : ${arr}`)
                       return  printProductCard(data.products,"gid://shopify/Product/836375124407")
                        }
                    );
                    string = array[0]
                    console.log(string)

                }}
                >
            </ResourcePicker>
            <Layout>
            { printProductCard(data.products,array[0]) }
            </Layout>
            <TextField
                label="Product Title"
                autoComplete="off"
                value={string}
                onChange={setTitle}>

            </TextField>



            <p>
                Sample products are created with a default title and price. You can
                remove them at any time.
            </p>


        </LegacyCard>

    );
}