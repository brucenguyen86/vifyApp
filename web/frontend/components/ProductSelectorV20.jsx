import {Button, LegacyCard} from "@shopify/polaris";
import React from "react";
import {ResourcePicker} from "@shopify/app-bridge/actions";
import createApp from "@shopify/app-bridge";
import config from "nodemon/lib/config/index.js";




export const ProductSelectorV20 = () => {



// Another resources picker :

    const arr = []
const app = createApp(config);
    const productPicker = ResourcePicker.create(app,{
        resourceType: ResourcePicker.ResourceType.Product
    })
const variantPicker = ResourcePicker.create(app, {
    resourceType: ResourcePicker.ResourceType.ProductVariant
})
    const collectionPicker = ResourcePicker.create (app,{
        resourceType: ResourcePicker.ResourceType.Collection
    })

    const picker = ResourcePicker.create(app,{
        resourceType: ResourcePicker.ResourceType.Product
    })

    picker.subscribe(ResourcePicker.Action.SELECT, (selectPayload) => {
        const selection = selectPayload.selection;
        selection.map(product => arr.push(product))
    })

    return (

        <LegacyCard
            title="Product Selector"
            sectioned


        >



            <Button onClick={() => console.log('abc') } >Select </Button>




            <p>
                Sample products are created with a default title and price. You can
                remove them at any time.
            </p>


        </LegacyCard>

    );
}