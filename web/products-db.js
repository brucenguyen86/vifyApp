import shopify from "./shopify.js";
import sqlite3 from "sqlite3";
import path from "path";

const DEFAULT_DB_FILE = path.join(process.cwd(), "database.sqlite");
export const ProductsDB = {
    productTableName: 'product',
    db: null,
    ready: null,


    create: async function ({
                                shopDomain,
                                productId,
                                productDescription,
                                productTitle,
                                handle,
                                variantId,
                                variantPrice,
                                variantTitle,
                            }
    ) {
        await this.ready;
        const query =
            `INSERT INTO ${this.productTableName}
                 (shopDomain, productId, productDescription, productTitle,handle, variantId, variantPrice,variantTitle)
             VALUES (?, ?, ?, ?, ?,?,?,?) RETURNING id;
            `;
        const rawResults = await this.__query(query, [
            shopDomain,
            productId,
            productDescription,
            productTitle,
            handle,
            variantId,
            variantPrice,
            variantTitle,
        ]);
        return rawResults[0].id;
    },
    update: async function (
        id,
        {
            shopDomain,
            productId,
            productDescription,
            productTitle,
            handle,
            variantId,
            variantPrice,
            variantTitle,
        }
    ) {
        await this.ready;
        const query = `
            UPDATE ${this.productTableName}
            SET shopDomain          =?,
                productId          = ?,
                productDescription = ?,
                productTitle       = ?,
                handle              = ?,
                variantId          = ?,
                variantPrice       = ?,
                variantTitle = ?
                WHERE
                    id = ?
        `;
        await this.__query(query, [
            shopDomain,
            productId,
            productDescription,
            productTitle,
            handle,
            variantId,
            variantPrice,
            variantTitle,
            id,
        ])
        return true;
    },
    list: async function (shopDomain) {
        await this.ready;
        const query = `
            SELECT *
            FROM ${this.productTableName}
            WHERE shopDomain = ?;
        `
        const result = await this.__query(query, [shopDomain]);
        return result.map((product) => this.__addImageUrl(product))
    },
    read: async function (id) {
        await this.ready;
        const query = `
            SELECT *
            FROM ${this.productTableName}
            WHERE id = ?;
        `
        const rows = await this.__query(query, [id]);
        // Look up for this
        if (!Array.isArray(rows) || rows?.length !== 1) return undefined;
        return this.__addImageUrl(rows[0])
    },
    delete: async function(id){
        await this.ready;
        const query =`
        DELETE FROM ${this.productTableName}
        WHERE id=?`;
        await this.__query(query,[id])
        return true;
    },


    // The destination URL for Product is generated at query time
    // generateProductDestinationUrl: function (product) {
    //     return
    //     `${shopify.api.config.hostScheme}://${shopify.api.config.hostName}/products/${product.id}/edit`;
    // },
    /* Private */
    /*
      Used to check whether to create the database.
      Also used to make sure the database and table are set up before the server starts.
    */
    __hasProductTable: async function () {
        const query = `
            SELECT name
            FROM sqlite_schema
            WHERE type = 'table'
              AND name = ?;
        `;
        const rows = await this.__query(query, [this.productTableName]);
        return rows.length === 1;
    },
    // Initializes the connection with the app's sqlite3 database'
    init: async function () {
        // Initializes the connection to the database
        this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);
        const hasProductTable = await this.__hasProductTable();
        if (hasProductTable) {
            this.ready = Promise.resolve();
            // Create Product table if it hasn't been created
        } else {
            const query = `
                CREATE TABLE ${this.productTableName}
                (
                    id                 INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    shopDomain  VARCHAR(511) NOT NULL ,
                    productId          VARCHAR(511) NOT NULL,
                    productDescription VARCHAR(511) NOT NULL,
                    productTitle       VARCHAR(255) NOT NULL,
                    handle VARCHAR(511) NOT NULL ,
                    variantId          VARCHAR(255) NOT NULL,
                    variantPrice       VARCHAR(255) NOT NULL,
                    variantTitle VARCHAR(255) NOT NULL ,
                )`;
            // Tell the various CRUD methods that they can execute
            this.ready = this.__query(query);
        }
    },
    // Perform a query on the database . Used by the various CRUD methods
    __query: function (sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    },




    __addImageUrl: function (product) {
        try {
            product.image.url = this.__generateProductImageUrl(product);
        } catch (err) {
            console.log(err)
        }
    },

    __generateProductImageUrl: function (product) {
        return `
        ${shopify.api.config.hostScheme}://${shopify.api.config.hostName}/products/${product.id}/image
        `
    },
    __goToProductView: function (url, product) {
        return productViewURL({
            host: url.toString(),
            productHandle: product.handle,
        });
    },


}
    // Generate the URL to a product page
    function productViewURL({host, productHandle})
{
    const url = new URL(host);
    const productPath = `/products/${productHandle}`;
    url.pathname = productPath;
    return url.toString();
}

// Generate the URL to



