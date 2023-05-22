import {
    IndexTable, LegacyCard, useIndexResourceState, TextField
} from '@shopify/polaris';
import React from 'react';

export const Variants = ({variants, updateVariant}) => {
    // Variant :


    const resourceName = {
        singular: 'variant',
        plural: 'variants',
    };

    const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(variants);

    const rowMarkup = variants.map(({id, title, price}, index) => (
        <IndexTable.Row
            id={id}
            key={id}
            selected={selectedResources.includes(id)}
            position={index}
        >
            <IndexTable.Cell>{title}</IndexTable.Cell>
            <IndexTable.Cell>
                <TextField
                    autoComplete="on"
                    prefix="$"
                    label="Price"
                    labelHidden={true}
                    value={price} // the value of variant.price
                    onChange={price => updateVariant(id,price)} // id here is the value of each variant , price here is the changed value
                ></TextField>
            </IndexTable.Cell>


        </IndexTable.Row>),);

    return (<LegacyCard>
            <IndexTable
                resourceName={resourceName}
                itemCount={variants.length}
                // selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                // onSelectionChange= {handleSelectionChange}
                headings={[{title: 'Title'}, {title: 'Price'},]}
                selectable={false}
            >
                {rowMarkup}
            </IndexTable>
        </LegacyCard>

    );
}