import shopify from "../shopify.js";
import {GraphqlQueryError} from "@shopify/shopify-api";


const FETCH_CUSTOMERS_QUERY = `{
  customers(first: 10) {
    edges {
      node {
        id
        email
        displayName
      }
    }
  }
}
`

const formatGQLResponse = (res) => {
    // edges : an array to hold all data
    const edges = res?.body?.data?.customers?.edges || []
    if (!edges.length) return [];
    return edges.map(({node}) => ({
        customerId: node.id,
        name: node.displayName,
        email: node.email,
    }));
};
export default async function fetchCustomers(session) {
    const client = new shopify.api.clients.Graphql({session});

    try {
        return formatGQLResponse(await client.query({
            data: {
                query: FETCH_CUSTOMERS_QUERY,
            }
        }))

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

