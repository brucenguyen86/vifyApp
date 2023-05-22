import {
    Button, Collapsible, FormLayout, Grid, Layout, LegacyCard, TextField
} from "@shopify/polaris";
import {trophyImage} from "../assets/index.js";
import React, {useState} from "react";
import {Variants} from "./Variants.jsx";
import {useAppQuery, useAuthenticatedFetch} from "../hooks/index.js";
import {useNavigate} from "@shopify/app-bridge-react";

export const ProductCard = (props) => {
    const [title, setTitle] = useState(props.title);
    const [id,setID] = useState(props.id)
    const [description, setDescription] = useState(props.description);
    const [showVariants, setShowVariants] = useState(false);
    const [variants, setVariants] = useState(props.variants);
    // This is another Hook apart from "useAppQuerry" just a different way to do thing.
    const fetch = useAuthenticatedFetch();

    // Use that to easily move between pages in admin
    const navigate = useNavigate();

    // Hooks : helps to query better from the backend
    // const {data, isLoading, refetch, isRefetching} = useAppQuery({
    //     url: "/api/products/update",
    // });
    //
    // console.log("data from Product Card : ", data)
    //

    const onUpdate = async () => {
        const updatedProduct = {
            id: id,
            title,
            description,
            variants
        }
        const response = await fetch('/api/products/update', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedProduct)
        });
         console.log("response: ",response)
        console.log("response ok? " ,response.ok)
        if (response.ok) {
            console.log("Success!");
        }
    }

    const updateVariant = (id, price) => {
        setVariants((prev) => {
            let updatedVariants;
            updatedVariants = prev.map(variant => {
                if (id === variant.id) {
                    return {...variant, price};
                }
                return variant; //if there is no match, we will return to variant unchanged
            });
            return updatedVariants; // This is an array
        });
    };

    return <Layout.Section>
        <Grid>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                <LegacyCard sectioned={true}
                            primaryFooterAction={{
                                content: "Update Product",
                                onAction: onUpdate
                            }}
                            secondaryFooterActions={[{
                                content: "View in Admin", onAction: () => navigate({
                                        name: "Product", resource: {id: props.legacyID}
                                    }, {target: "new"} // we want to open it in new Tab -> read more in App birdge Docs
                                ),
                            }]}
                >


                    <img src={props.image || trophyImage} alt="" width="250"/>
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                <LegacyCard title="Orders" sectioned>
                    <FormLayout>
                        <TextField
                            label="Product Title"
                            autoComplete="off"
                            value={title}
                            onChange={setTitle}></TextField>
                        <TextField
                            multiline={4}
                            label="Product Description"
                            autoComplete="off"
                            value={description}
                            onChange={setDescription}
                        ></TextField>
                        <Button onClick={() => setShowVariants(prevState => !prevState)}>Show Variants</Button>
                        <Collapsible id={id} open={showVariants}>
                            <Variants variants={variants} updateVariant={updateVariant}/>
                        </Collapsible>
                    </FormLayout>
                </LegacyCard>


            </Grid.Cell>

        </Grid>
        <Layout.Section>

        </Layout.Section>

    </Layout.Section>


}