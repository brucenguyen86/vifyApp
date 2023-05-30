import shopify from "../shopify.js";
import {GraphqlQueryError} from "@shopify/shopify-api";
// Used for creating some common functions used by the backend to format Products data
// We are adding API layer so that the frontend can access the data
/*
  The app's database stores the productId
  This query is used to get the fields the frontend needs for those IDs.
  By querying the Shopify GraphQL Admin API at runtime, data can't become stale.
  This data is also queried so that the full state can be saved to the database, in order to generate QR code links.
*/

const FETCH_ORDERS_QUERY = `{
  orders(first: 5, reverse: true) {
    edges {
      node {
        id
        name
        displayFulfillmentStatus
       
        customer{
          id
          firstName
          lastName
          defaultAddress{
            address1
          }
        }
    
        lineItems(first: 50) {
          edges {
            node {
              id
              title
              quantity
            }
          }
        }
      }
    }
  }
}
`


const formatGQLResponse = (res) => {
    // edges : an array to hold all data
    const edges = res?.body?.data?.orders?.edges || []
    if (!edges.length) return [];
    return edges.map(({node}) => ({
        orderId : node.id,
        orderName: node.name,

        customerId : node.customer.id,
        customerFirstName : node.customer.firstName,
        customerLastName: node.customer.lastName,
        fulfillmentStatus: node.displayFulfillmentStatus,
        products: node.lineItems.edges.map(({node}) => ({
            id: node.id,
            title: node.title,
            // price: node.price,
            quantity: node.quantity
        })),
        // tax: node.total_tax,
        // discount: node.total_discounts,
        // subTotal: node.subTotal,
        // total: node.total_price,
    }));
};
export default async function fetchOrders(session) {
    const client = new shopify.api.clients.Graphql({session});

    try {
        return formatGQLResponse(await client.query({
            data: {
                query: FETCH_ORDERS_QUERY,
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
