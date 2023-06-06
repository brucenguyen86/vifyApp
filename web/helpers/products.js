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

const FETCH_PRODUCTS_QUERY = `{
  products(first: 10) {
    edges {
      node {
        id
        title
        description
        legacyResourceId
        images(first: 1) {
          edges {
            node {
              url
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              price
              title
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
    const edges = res?.body?.data?.products?.edges || []
    if (!edges.length) return [];
    return edges.map(({node}) => ({
        id: node.id,
        legacyID: node.legacyID,
        title: node.title,
        description: node.description,
        image: node.images.edges[0]?.node?.url || "https://w7.pngwing.com/pngs/915/345/png-transparent-multicolored-balloons-illustration-balloon-balloon-free-balloons-easter-egg-desktop-wallpaper-party-thumbnail.png",
        variants: node.variants.edges.map(({node}) => ({
            id: node.id,
            title: node.title,
            price: node.price,
        })),
    }));
};
export default async function fetchProducts(session) {
    const client = new shopify.api.clients.Graphql({session});

    try {
        return formatGQLResponse(await client.query({
            data: {
                query: FETCH_PRODUCTS_QUERY,
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

export async function getShopUrlFromSession(req,res) {
    return `https://${res.locals.shopify.session.shop}`;
}