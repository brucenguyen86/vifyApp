import shopify from "../shopify.js";
import { ProductsDB } from "../products-db.js";
// Used for creating some common functions used by the backend to format Products data
// We are adding API layer so that the frontend can access the data
/*
  The app's database stores the productId
  This query is used to get the fields the frontend needs for those IDs.
  By querying the Shopify GraphQL Admin API at runtime, data can't become stale.
  This data is also queried so that the full state can be saved to the database, in order to generate QR code links.
*/
const PRODUCT_ADMIN_QUERY = `
  query nodes($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        handle
        title
        images(first: 1) {
          edges {
            node {
              url
            }
          }
        }
      }
      ... on ProductVariant {
        id
      }
      ... on DiscountCodeNode {
        id
      }
    }
  }
`;

export async function getProductOr404(req, res, checkDomain = true) {
    try {
        const response = await ProductsDB.read(req.params.id);
        if (
            response === undefined ||
            (checkDomain &&
                (await getShopUrlFromSession(req, res)) !== response.shopDomain)
        ) {
            res.status(404).send();
        } else {
            return response;
        }
    } catch (error) {
        res.status(500).send(error.message);
    }

    return undefined;
}

export async function getShopUrlFromSession(req, res) {
    return `https://${res.locals.shopify.session.shop}`;
}

/*
Expect body to contain
                                productId: String
                                productDescription: String
                                productTitle: String
                                variantId: String
                                variantPrice: String
*/
export async function parseProductBody(req, res) {
    return {
        productId: req.body.productId,
        variantId: req.body.variantId,
        variantPrice: req.body.price,
        productTitle: req.body.title,
        productDescription: req.body.description
    };
}

/*
  Replaces the productId with product data queried from the Shopify GraphQL Admin API
*/
export async function formatProductResponse(req, res, rawCodeData) {
    const ids = [];

    /* Get every product, variant and discountID that was queried from the database */
    rawCodeData.forEach(({ productId, variantId }) => {
        ids.push(productId);
        ids.push(variantId);

    });

    /* Instantiate a new GraphQL client to query the Shopify GraphQL Admin API */
    const client = new shopify.api.clients.Graphql({
        session: res.locals.shopify.session,
    });

    /* Query the Shopify GraphQL Admin API */
    const adminData = await client.query({
        data: {
            query: PRODUCT_ADMIN_QUERY,

            /* The IDs that are pulled from the app's database are used to query product, variant and discount information */
            variables: { ids },
        },
    });

    /*
      Replace the product and variant IDs with the data fetched using the Shopify GraphQL Admin API.
    */
    const formattedData = rawCodeData.map((product_) => {
            const product = adminData.body.data.nodes.find(
                (node) => product_.productId === node?.id
                // Pay attention to this code , i have changed : qrcode -> product_
            ) || {
                title: "Deleted product",
            };


            /*
              A user might create a QR code with a discount code and then later delete that discount code.
              For optimal UX it's important to handle that edge case.
              Use mock data so that the frontend knows how to interpret this QR Code.
            */

// codes has been deleted
            /*
              Merge the data from the app's database with the data queried from the Shopify GraphQL Admin API
            */
            // COdes has been deleted

            /* Since product.id already exists, productId isn't required */
            // codes has been deleted


            return formattedData;
        }
    )
}