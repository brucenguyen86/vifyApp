import shopify from "./shopify.js";
import {GraphqlQueryError} from "@shopify/shopify-api";


const UPDATE_PRODUCTS_MUTATION = `
mutation updateProduct($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
        descriptionHtml
        title
        variants (first: 10) {
          edges {
            node {
              id
              price
            }
          }
        }
      }
    }
  }
`;
// pay attention to the number of variants, you will change if you have more

export default async function productUpdater(session,{id, description,title, variants}) {
    const client = new shopify.api.clients.Graphql({session});

    try {
        return await client.query({
            data: {
                query: UPDATE_PRODUCTS_MUTATION,
                // variants or variables
                variables: {
                    input: {
                        id,
                        descriptionHtml: description,
                        title,
                        variants,
                    }
                }
            }
        })

    } catch (error) {
        if (error instanceof GraphqlQueryError) {
            throw new Error(
                `${error.message}\n${JSON.stringify(error.response, null, 2)}`
            );
        } else {
            throw error;
        }
    }
}

