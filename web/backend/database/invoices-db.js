import sqlite3 from "sqlite3";
import path from "path";

const DEFAULT_DB_FILE = path.join(process.cwd(), "database.sqlite");

export const InvoicesDb = {
    productTableName: 'product',
    customerTableName: 'customer',
    invoiceTableName: 'invoice',
    variantsTable: 'variants',
    lineItemsTable: 'lineItem',
    db: null,
    ready: null,

    insert: async function ({
                                productId,
                                productDescription,
                                productTitle,
                            }
    ) {
        await this.ready;

        const query =
            `INSERT INTO ${this.productTableName} (productId, productDescription, productTitle)
             VALUES (?, ?, ?) RETURNING id`;
        let isInserted = false
        const isFound = await this.findProductById(productId);
        console.log("isFoundProduct: ", isFound)
        if (isFound === false) {
            const rawResults = await this.__query(query, [
                productId,
                productDescription,
                productTitle,
            ]);

            isInserted = true;

        }
        return isInserted;
    },

    insertVariants: async function ({
                                        productId,
                                        variantId,
                                        variantTitle,
                                        price,
                                    }
    ) {
        await this.ready;

        const query =
            `INSERT INTO ${this.variantsTable} (productId, variantId, variantTitle, price)
             VALUES (?, ?, ?, ?) RETURNING id`;
        let isInserted = false
        const isFound = await this.findVariantById(variantId);
        console.log("isFroundVariant: ", isFound)
        if (isFound === false) {
            const rawResults = await this.__query(query, [
                productId,
                variantId,
                variantTitle,
                price,
            ]);
            isInserted = true;
        }
        return isInserted;
    },

    insert_Customer: async function ({
                                         customerId,
                                         name,
                                         email,
                                     }
    ) {
        await this.ready;
        const query =
            `INSERT INTO ${this.customerTableName} (customerId, name, email)
             VALUES (?, ?, ?) RETURNING id`;
        const isFound = await this.findCustomerById(customerId);
        let isInserted = false
        if (!isFound) {
            console.log()
            const rawResults = await this.__query(query, [
                customerId,
                name,
                email,
            ]);
            isInserted = true;
        }
        return isInserted
    },
    insertLineItem: async function ({invoiceId, productId, productName, productDescription, variantId, price, quantity, subTotal}) {
        await this.ready;
        const query =
            `INSERT INTO ${this.lineItemsTable} (invoiceId, productId, productName, productDescription, variantId,price, quantity, subTotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`;
        // const isFound = await this.findLineItemByVariantId(variantId);
        console.log("query to insert Line Item")
        let isInserted = false
        // if (!isFound) {
        //     console.log()
        const rawResults = await this.__query(query, [invoiceId, productId, productName, productDescription, variantId, price, quantity, subTotal]);
        isInserted = true;
        // }
        return isInserted
    },
    insert_Invoice: async function ({
                                        companyName,
                                        companyEmail,
                                        companyCountry,
                                        companyCity,
                                        companyAddress,
                                        companyZipCode,
                                        customerId,
                                        customerName,
                                        customerEmail,
                                        customerAddress,
                                        customerCity,
                                        customerCountry,
                                        customerZipCode,
                                        subTotal,
                                        tax,
                                        total
                                    }
    ) {
        await this.ready;
        const query =
            `INSERT INTO ${this.invoiceTableName} (companyName,
                                                   companyEmail,
                                                   companyCountry,
                                                   companyCity,
                                                   companyAddress,
                                                   companyZipCode,
                                                   customerId,
                                                   customerName,
                                                   customerEmail,
                                                   customerAddress,
                                                   customerCity,
                                                   customerCountry,
                                                   customerZipCode,
                                                    subTotal,
                                                   tax,
                                                   total)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?) RETURNING id`;
        // const isFound  = await this.findCustomerById(customerId);
        // let isInserted = false
        // if (!isFound) {
        //     console.log()
        // console.log("query", query)
        const rawResults = await this.__query(query, [
            companyName,
            companyEmail,
            companyCountry,
            companyCity,
            companyAddress,
            companyZipCode,
            customerId,
            customerName,
            customerEmail,
            customerAddress,
            customerCity,
            customerCountry,
            customerZipCode,
            subTotal,
            tax,
            total
        ])


        return rawResults[0].id;
    },

    update: async function (
        {
            productId,
            productDescription,
            productTitle,
        }
    ) {
        await this.init();
        await this.ready;
        const query = `
            UPDATE ${this.productTableName}
            SET productDescription = ?,
                productTitle       = ?,
                WHERE
                    productId = ?
        `;
        await this.__query(query, [
            productId,
            productDescription,
            productTitle,
        ])
        return true;
    },
    list: async function () {
        await this.ready;
        const query = `
            SELECT *
            FROM ${this.productTableName}
        `
        return await this.__query(query, [], (err, rows) => {
            if (err) {
                throw err
            }
            return rows
        });
    },
    read: async function (id) {
        // await this.init();
        await this.ready;
        const query = `SELECT *
                       FROM ${this.productTableName}
                       WHERE id = ?`
        const rows = await this.__query(query, [id]);
        // Look up for this
        if (!Array.isArray(rows) || rows?.length !== 1) return undefined;
        return rows[0]
    },
    findProductById: async function (productId) {
        await this.ready;
        let isFound = false
        const query = `SELECT *
                       FROM ${this.productTableName}
                       WHERE productId = ?`
        const result = await this.__query(query, [productId], (err, row) => {
            if (err) {
                throw err
            }
            return row
        })
        if (result.length !== 0) {
            isFound = true
        }
        console.log(isFound)
        return isFound;
    },
    findLineItemByVariantId: async function (variantId) {
        await this.ready;
        let isFound = false
        const query = `SELECT *
                       FROM ${this.lineItemsTable}
                       WHERE variantId = ?`
        const result = await this.__query(query, [variantId], (err, row) => {
            if (err) {
                throw err
            }
            return row
        })
        if (result.length !== 0) {
            isFound = true
        }
        console.log(isFound)
        return isFound;
    },

    findVariantById: async function (variantId) {
        await this.ready;
        let isFound = false
        const query = `SELECT *
                       FROM ${this.variantsTable}
                       WHERE variantId = ?`
        const result = await this.__query(query, [variantId], (err, row) => {
            if (err) {
                throw err
            }
            return row
        })
        if (result.length !== 0) {
            isFound = true
        }
        console.log(isFound)
        return isFound;
    },

    findCustomerById: async function (customerId) {
        await this.ready;
        let isFound = false
        const query = `SELECT *
                       FROM ${this.customerTableName}
                       WHERE customerId = ?`
        const result = await this.__query(query, [customerId], (err, row) => {
            if (err) {
                throw err
            }
            return row
        })
        if (result.length !== 0) {
            isFound = true
        }
        // console.log(isFound)
        return isFound;
    },

    findInvoiceById: async function (invoiceId) {
        await this.ready;
        let isFound = false
        const query = `SELECT *
                       FROM ${this.invoiceTableName}
                       WHERE id = ?`
        const result = await this.__query(query, [invoiceId], (err, row) => {
            if (err) {
                throw err
            }
            return row
        })
        if (result.length !== 0) {
            isFound = true
        }
        // console.log(isFound)
        return isFound;
    },
    selectInvoiceById: async function (id) {
        await this.ready;
        let isFound = false
        const query = `SELECT *
                       FROM ${this.invoiceTableName}
                       WHERE id = ?`
        const result = await this.__query(query, [id])

        console.log("result of select Invoice", result.length)
        if (result.length !== null) {
            isFound = true
        }
        // console.log(isFound)

        return result;
    },
    selectLastInvoice: async function () {
        await this.ready;
        let isFound = false
        const query = `SELECT *
                           FROM ${this.invoiceTableName} ORDER BY ROWID DESC LIMIT 1`
        const result = await this.__query(query)
        console.log("result of select Invoice", result.length)
        if (result.length !== null) {
            isFound = true
        }
        // console.log(isFound)
        return result[0];
    },
    selectLastLineItems: async function () {
        await this.ready;
        let isFound = false
        const pre_query = `SELECT *
                           FROM ${this.lineItemsTable} ORDER BY ROWID DESC LIMIT 1`
        const pre_result = await this.__query(pre_query)
        const invoiceID = pre_result[0].invoiceId
        console.log("pre_result of select last Line Item",pre_result[0])
        console.log("invoiceID",invoiceID)
        const query = `SELECT *
                       FROM ${this.lineItemsTable}
                       WHERE invoiceId = ?`
        const result = await this.__query(query, [invoiceID])
        console.log("result of select Last Line Items", result.length)
        if (result.length !== null) {
            isFound = true
        }
        // console.log(isFound)
        return result;
    },

    selectAllLineItemsOfInvoice: async function (invoiceId) {
        await this.ready;
        let isFound = false
        const query = `SELECT * FROM ${this.lineItemsTable} WHERE invoiceId=?`

        const result = await this.__query(query, [invoiceId])

        console.log("result of select Line Items", result.length)
        if (result.length !== null) {
            isFound = true
        }
        // console.log(isFound)

        return result;
    },
    selectAllInvoice: async function () {
        await this.ready;
        let isFound = false
        const query = `SELECT *
                       FROM ${this.invoiceTableName}`
        const result = await this.__query(query, [])

        console.log("result of select Invoice", result.length)
        if (result.length !== null) {
            isFound = true
        }
        // console.log(isFound)

        return result;
    },
    selectAllProducts: async function () {
        await this.ready;
        let isFound = false
        const query = `SELECT *
                       FROM ${this.productTableName}`
        const result = await this.__query(query, [])

        console.log("result of select Products", result.length)
        // console.log("Result",result)
        if (result.length !== null) {
            isFound = true
        }
        // console.log(isFound)

        return result;
    },
    selectAllVariants: async function () {
        await this.ready;
        let isFound = false
        const query = `SELECT *
                       FROM ${this.variantsTable}`
        const result = await this.__query(query, [])

        console.log("result of select all Variants", result.length)
        // console.log("Result",result)
        if (result.length !== null) {
            isFound = true
        }
        // console.log(isFound)

        return result;
    },
    selectVariantListByProductId: async function (productId) {
        await this.ready;
        let isFound = false
        const query = `SELECT *
                       FROM ${this.variantsTable}
                       WHERE productId = ?`
        const result = await this.__query(query, [])

        console.log("result of select Variant List By ProductId", result.length)
        // console.log("Result",result)
        if (result.length !== null) {
            isFound = true
        }
        // console.log(isFound)

        return result;
    },
    selectAllCustomers: async function () {
        await this.ready;
        let isFound = false
        const query = `SELECT *
                       FROM ${this.customerTableName}`
        const result = await this.__query(query, [])

        console.log("result of select Customers", result.length)
        if (result.length !== null) {
            isFound = true
        }
        // console.log(isFound)

        return result;
    },

    selectProductById: async function (id) {
        await this.ready;
        let isFound = false
        const query = `SELECT *
                       FROM ${this.productTableName}
                       WHERE productId = ?`
        const result = await this.__query(query, [id])

        console.log("result of select Product", result.length)
        // console.log(result[0].productId)
        if (result.length !== null) {
            isFound = true
        }
        // console.log(isFound)

        return result[0];
    },

    selectCustomerById: async function (customerId) {
        await this.ready;
        let isFound = false
        const query = `SELECT *
                       FROM ${this.customerTableName}
                       WHERE customerId = ?`
        const result = await this.__query(query, [customerId])

        console.log("result of select Customer", result.length)
        if (result.length !== null) {
            isFound = true
        }
        // console.log(isFound)

        return result[0];
    },
    selectVariantById: async function (variantId) {
        await this.ready;
        let isFound = false
        const query = `SELECT *
                       FROM ${this.variantsTable}
                       WHERE variantId = ?`
        const result = await this.__query(query, [variantId])

        console.log("result of select Variant by Id", result.length)
        if (result.length !== null) {
            isFound = true
        }
        // console.log(isFound)

        return result[0];
    },

    delete: async function (productId) {
        await this.init();
        await this.ready;
        const query = `
            DELETE
            FROM ${this.productTableName}
            WHERE productId = ?`;
        await this.__query(query, [productId])
        return true;
    },
    __hasCustomerTable: async function () {
        const query = `
            SELECT name
            FROM sqlite_schema
            WHERE type = 'table'
              AND name = ?;
        `;
        const rows = await this.__query(query, [this.customerTableName]);
        return rows.length === 1;
    },


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
    __hasVariantsTable: async function () {
        const query = `
            SELECT name
            FROM sqlite_schema
            WHERE type = 'table'
              AND name = ?;
        `;
        const rows = await this.__query(query, [this.variantsTable]);
        return rows.length === 1;
    },
    __hasInvoiceTable: async function () {
        const query = `
            SELECT name
            FROM sqlite_schema
            WHERE type = 'table'
              AND name = ?;
        `;
        const rows = await this.__query(query, [this.invoiceTableName]);
        return rows.length === 1;
    },
    __hasLineItemsTable: async function () {
        const query = `
            SELECT name
            FROM sqlite_schema
            WHERE type = 'table'
              AND name = ?;
        `;
        const rows = await this.__query(query, [this.lineItemsTable]);
        return rows.length === 1;
    },
    // Initializes the connection with the app's sqlite3 database'
    init: async function () {
        // Initializes the connection to the database
        this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);
        const hasProductTable = await this.__hasProductTable();
        const hasCustomerTable = await this.__hasCustomerTable();
        const hasInvoiceTable = await this.__hasInvoiceTable();
        const hasVariantsTable = await this.__hasVariantsTable();
        const hasLineItemTable = await this.__hasLineItemsTable()

        if (hasProductTable) {
            this.ready = Promise.resolve();
            // Create Product table if it hasn't been created
        } else {
            console.log("Product Table: come here")
            const query = `CREATE TABLE ${this.productTableName}
                           (
                               id                 INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                               productId          VARCHAR(511) NOT NULL,
                               productDescription VARCHAR(511) NOT NULL,
                               productTitle       VARCHAR(255) NOT NULL
                           )`;
            // Tell the various CRUD methods that they can execute
            this.ready = await this.__query(query)
            console.log(query)
        }

        if (hasVariantsTable) {
            this.ready = Promise.resolve();
            // Create Product table if it hasn't been created
        } else {
            console.log("Variants Table: come here")
            const query = `CREATE TABLE ${this.variantsTable}
                           (
                               id           INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                               productId    VARCHAR(511) NOT NULL,
                               variantId    VARCHAR(511) NOT NULL,
                               variantTitle VARCHAR(511) NOT NULL,
                               price        VARCHAR(255) NOT NULL,
                           )`;
            // Tell the various CRUD methods that they can execute
            this.ready = await this.__query(query)
            console.log(query)
        }

        if (hasCustomerTable) {
            this.ready = Promise.resolve();
            // Create Product table if it hasn't been created
        } else {
            console.log("Customer Table : come here")
            const query = `CREATE TABLE ${this.customerTableName}
                           (
                               id         INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                               customerId VARCHAR(511) NOT NULL,
                               name       VARCHAR(511) NOT NULL,
                               email      VARCHAR(255) NOT NULL
                           )`;
            // Tell the various CRUD methods that they can execute
            this.ready = await this.__query(query)
            console.log("Query customer: ", query)
        }
        if (hasLineItemTable) {
            this.ready = Promise.resolve();
            // Create Product table if it hasn't been created
        } else {
            console.log("LineItems Table : come here")
            const query = `CREATE TABLE ${this.lineItemsTable}
                           (
                               id                 INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                               invoiceId          VARCHAR(511) NOT NULL,
                               productId          VARCHAR(511) NOT NULL,
                               productName        VARCHAR(511) NOT NULL,
                               productDescription VARCHAR(511) NOT NULL,
                               variantId          VARCHAR(511) NOT NULL,
                               price              VARCHAR(255) NOT NULL,
                               quantity           VARCHAR(255) NOT NULL,
                               subTotal           FLOAT        NOT NULL
                           )`;
            // Tell the various CRUD methods that they can execute
            this.ready = await this.__query(query)
            console.log("Query Line items: ", query)
        }
        if (hasInvoiceTable) {
            this.ready = Promise.resolve();
            // Create Product table if it hasn't been created
        } else {
            const query = `CREATE TABLE ${this.invoiceTableName}
                           (
                               id              INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                               companyName     VARCHAR(255) NOT NULL,
                               companyEmail    VARCHAR(255) NOT NULL,
                               companyCountry  VARCHAR(255) NOT NULL,
                               companyCity     VARCHAR(255) NOT NULL,
                               companyAddress  VARCHAR(255) NOT NULL,
                               companyZipCode  VARCHAR(255) NOT NULL,
                               customerId      VARCHAR(255) NOT NULL,
                               customerName    VARCHAR(511) NOT NULL,
                               customerEmail   VARCHAR(255) NOT NULL,
                               customerAddress VARCHAR(255) NOT NULL,
                               customerCity    VARCHAR(255) NOT NULL,
                               customerCountry VARCHAR(255) NOT NULL,
                               customerZipCode VARCHAR(255) NOT NULL,
                               subTotal        FLOAT        NOT NULL,
                               tax             VARCHAR(255) NOT NULL,
                               total           FLOAT        NOT NULL
                           )`;
            // Tell the various CRUD methods that they can execute
            this.ready = await this.__query(query)
            // console.log(query)
        }

    },

    // Perform a query on the database . Used by the various CRUD methods
    __query: async function (sql, body = []) {
        return new Promise((resolve, reject) => {
            try {
                this.db.all(sql, body, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                    // console.log("result of query",result)
                    return result;
                })
            } catch (e) {
                console.log(e)
            }
        });
    },


}



