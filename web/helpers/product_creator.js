import {GraphqlQueryError} from "@shopify/shopify-api";

import express from "express";
import shopify from "../shopify.js";

const CREATE_PRODUCTS_MUTATION = `
  mutation productCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
      }
      userErrors {
        message
       }
    }
  }
`;

export default async function productCreator(req, session) {
    const client = new shopify.api.clients.Graphql({session});
    try {
        const x= await client.query({
            data: {
                query: CREATE_PRODUCTS_MUTATION,
                variables: {
                    input: {
                        title: req.body.title,
                        descriptionHtml: req.body.description,
                        images: [
                            {src: req.body.imageUrl}
                        ],
                        variants: req.body.variant,
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

