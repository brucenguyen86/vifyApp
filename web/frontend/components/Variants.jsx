import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text, TextField
} from '@shopify/polaris';
import React from 'react';

export const Variants =({variants, updateVariant}) => {
    // Variant :


    const resourceName = {
        singular: 'variant',
        plural: 'variants',
    };

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(variants);

    const rowMarkup = variants.map(
        (
            {id,title,price},index
        ) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>{title}</IndexTable.Cell>
                <IndexTable.Cell>
                    <TextField
                        autoComplete="off"
                        prefix="$"
                        label="Price"
                        labelHidden={true}
                        value={price}
                        onChange={(pr) => updateVariant(id,pr)}
                    ></TextField>
                </IndexTable.Cell>



            </IndexTable.Row>
        ),
    );

    return (
        <LegacyCard>
            <IndexTable
                resourceName={resourceName}
                itemCount={variants.length}
                selectedItemsCount={
                    allResourcesSelected ? 'All' : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                    {title: 'Title'},
                    {title: 'Price'},
                ]}
            >
                {rowMarkup}
            </IndexTable>
        </LegacyCard>

    );
}