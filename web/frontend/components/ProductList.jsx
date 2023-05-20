import {ProductCard} from "./ProductCard.jsx";
import {AlphaCard, EmptyState, Layout, Spinner} from "@shopify/polaris";
import {trophyImage} from "../assets/index.js";

export const ProductList = ({data,isLoading,isRefetching}) =>{
    if ( isLoading || isRefetching )  {
        return (
            <Layout>
                <Spinner />
            </Layout>
        );
    }

    return <Layout>
        {data?.products.length ?data.products.map(product => <Layout.Section>
            <ProductCard {...product}></ProductCard>
        </Layout.Section>)
        : <Layout.Section>
                <AlphaCard>
                    <EmptyState image={trophyImage} heading = "No Products Found" ></EmptyState>
                </AlphaCard>
            </Layout.Section> }
    </Layout>
}