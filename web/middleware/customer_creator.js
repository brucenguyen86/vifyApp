import {GraphqlQueryError} from "@shopify/shopify-api";

import shopify from "../shopify.js";

const CREATE_CUSTOMERS_MUTATION = `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
            id
      }
      userErrors {
      field
      message
      }
    }
  }
`;

export default async function customerCreator(req, session) {
    const client = new shopify.api.clients.Graphql({session});

    try {
        await client.query({
            data: {
                query: CREATE_CUSTOMERS_MUTATION,
                variables: {
                    input: {
                        email: req.body.email,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        // phone: req.body.phone,
                        // addresses: [
                        //     {
                        //         country: req.body.country,
                        //         city: req.body.city,
                                // zip: req.body.zip,
                                // address1: req.body.address1,
                            // }

                        // ]
                    },
                },
            },
        });
        return true
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

