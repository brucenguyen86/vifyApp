import {
    Badge,
    Button,
    Collapsible,
    FormLayout,
    Grid, Layout,
    LegacyCard,
    LegacyStack,
    MediaCard,
    TextField
} from "@shopify/polaris";
import {trophyImage} from "../assets/index.js";
import React, {useState} from "react";
import {Variants} from "./Variants.jsx";

export const ProductCard = (props) => {
    const [title, setTitle] = useState(props.title);
    const [description, setDescription] = useState(props.description);
    const [showVariants, setShowVariants] = useState(false)
    const [variants, setVariants] = useState(props.variants)
    const updateVariant = (id,price) => {
        setVariants((prev) => {
            const updatedVariants = prev.map((variant) => {
                if ( id === variant.id) {
                    return {...variant, price};
                }
                return variant;
            });
            return updatedVariants;
        });
    };

    return <Layout.Section>
        <Grid>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                <LegacyCard sectioned={true} primaryFooterAction={{content: "Update Product",
                    onAction: () => log('Update product')
                }} secondaryFooterActions={[{content: "View in Admin", onAction() {
                        console.log("View in Admin")
                    }}]}>


                    <img src={props.image || trophyImage} alt="" width="250" />
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                <LegacyCard title="Orders" sectioned>
                    <FormLayout>
                        <TextField
                            label="Product Title"
                            autoComplete="off"
                            value={title}
                            onChange={setTitle} ></TextField>
                        <TextField
                            multiline={4}
                            label="Product Description"
                            autoComplete="off"
                            value={description}
                            onChange={setDescription}
                        ></TextField>
                        <Button onClick={() => setShowVariants(prevState => !prevState)}>Show Variants</Button>
                        <Collapsible id={props.id} open={showVariants}>
                            <Variants variants={variants} updateVariant ={updateVariant}/>
                        </Collapsible>
                    </FormLayout>
                </LegacyCard>

            </Grid.Cell>

        </Grid>
        <Layout.Section>

        </Layout.Section>

    </Layout.Section>



}