import {
    IndexTable,
    LegacyCard,
    useIndexResourceState, TextField, Layout, Spinner
} from '@shopify/polaris';
import React from 'react';

export const ProductsTable =({products}) => {
    // Product :


    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(products);

    const rowMarkup = products.map(
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
                    ></TextField>
                </IndexTable.Cell>



            </IndexTable.Row>
        ),
    );

    if (isLoading || isRefetching) {
        return (
            <Layout>
                <Spinner/>
            </Layout>
        );
    }

    return <LegacyCard>
            <IndexTable
                resourceName={resourceName}
                itemCount={products.length}
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
}