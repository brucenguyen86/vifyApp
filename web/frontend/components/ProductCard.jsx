import {Badge, FormLayout, Grid, LegacyCard, LegacyStack, MediaCard, TextField} from "@shopify/polaris";
import {trophyImage} from "../assets/index.js";
import React from "react";
export const ProductCard = (props) => {
    return <Grid>
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
                        <TextField label="Product Title" autoComplete="off" value={props.title}  ></TextField>
                        <TextField multiline={4} label="Product Description" autoComplete="off" value={props.description}></TextField>
                    </FormLayout>
                </LegacyCard>
            </Grid.Cell>
        </Grid>



}