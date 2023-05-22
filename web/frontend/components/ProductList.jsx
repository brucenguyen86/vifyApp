
import { Layout, Spinner} from "@shopify/polaris";
import {ProductCard} from "./ProductCard.jsx";



export const ProductList = ({data, isLoading, isRefetching}) => {
    if (isLoading || isRefetching) {
        return (
            <Layout>
                <Spinner/>
            </Layout>
        );
    }
    const printProductCard = products =>
        products.filter(product => product.id === "gid://shopify/Product/8363751244077")
            .map(product => <ProductCard {...product} ></ProductCard> );


    return <Layout>
        { printProductCard(data.products) }
    </Layout>;

}

