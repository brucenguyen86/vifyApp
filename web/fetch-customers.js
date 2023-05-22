import shopify from "./shopify.js";
import {GraphqlQueryError} from "@shopify/shopify-api";


const FETCH_CUSTOMERS_QUERY = `{
  customers(first: 3) {
    edges {
      node {
        id
        firstName
        lastName
        
      }
    }
  }
}
`

// const formatGQLResponse = (res) => {
//     // edges : an array to hold all data
//     const edges = res?.body?.data?.customers?.edges || []
//     if (!edges.length) return [];
//     return edges.map(({node}) => ({
//         id: node.id,
//         firstname: node.firstname,
//         lastname: node.lastname,
//         email: node.email,
//         defaultAddress: node.defaultAddress.edges.map(({node}) => ({
//             city: node.city,
//             country: node.country,
//             zip: node.zip,
//         })),
//     }));
// };
export default async function fetchCustomers(session) {
    const client = new shopify.api.clients.Graphql({session});

    try {
        return await client.query({
            data: {
                query: FETCH_CUSTOMERS_QUERY,
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

