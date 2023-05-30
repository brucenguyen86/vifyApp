import sqlite3 from "sqlite3";
import path from "path";

const DEFAULT_DB_FILE = path.join(process.cwd(), "database.sqlite");

export const InvoicesDb = {
    productTableName: 'product',
    customerTableName: 'customer',
    invoiceTableName:'invoice',
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
        const isFound =  await this.findProductById(productId);
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
    insert_Customer: async function ({
                                customerId,
                                name,
                                email,
                            }
    ) {
        await this.ready;
        const query =
            `INSERT INTO ${this.customerTableName} (customerId, name ,email) VALUES (?, ?, ?) RETURNING id`;
        const isFound  = await this.findCustomerById(customerId);
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

    insert_Invoice: async function ({
                                        productId,
                                        productName,
                                        productDescription,
                                        productPrice,
                                        companyName,
                                        companyEmail,
                                        companyCountry,
                                        companyCity,
                                        companyAddress,
                                        customerId,
                                        customerName,
                                        customerEmail,
                                        customerAddress,
                                        customerCity,
                                        customerCountry,
                                        quantity,
                                        subtotal,
                                        total,
                                     }
    ) {
        await this.ready;
        const query =
            `INSERT INTO ${this.invoiceTableName} (productId,
                                                   productName,
                                                   productDescription,
                                                   productPrice,
                                                   companyName,
                                                   companyEmail,
                                                   companyCountry,
                                                   companyCity,
                                                   companyAddress,
                                                   customerId,
                                                   customerName,
                                                   customerEmail,
                                                   customerAddress,
                                                   customerCity,
                                                   customerCountry,
                                                   quantity,
                                                   subtotal,
                                                   total,) VALUES (?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) RETURNING id`;
        // const isFound  = await this.findCustomerById(customerId);
        // let isInserted = false
        // if (!isFound) {
        //     console.log()
            const rawResults = await this.__query(query, [
                productId,
                productName,
                productDescription,
                productPrice,
                companyName,
                companyEmail,
                companyCountry,
                companyCity,
                companyAddress,
                customerId,
                customerName,
                customerEmail,
                customerAddress,
                customerCity,
                customerCountry,
                quantity,
                subtotal,
                total,
            ])


        return true;
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
        const query = `SELECT * FROM ${this.productTableName} WHERE id = ?`
        const rows = await this.__query(query, [id]);
        // Look up for this
        if (!Array.isArray(rows) || rows?.length !== 1) return undefined;
        return rows[0]
    },
    findProductById: async function (productId) {
        await this.ready;
        let isFound = false
        const query = `SELECT * FROM ${this.productTableName} WHERE productId=?`
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

    findCustomerById: async function (customerId) {
        await this.ready;
        let isFound = false
        const query = `SELECT * FROM ${this.customerTableName} WHERE customerId=?`
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

    selectCustomerById: async function (customerId) {
        await this.ready;
        let isFound = false
        const query = `SELECT * FROM ${this.customerTableName} WHERE customerId=?`
        const result = await this.__query(query, [customerId])

        console.log("result of select",result.length)
        if (result.length !== null) {
            isFound = true
        }
        // console.log(isFound)

        return result;
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
    // Initializes the connection with the app's sqlite3 database'
    init: async function () {
        // Initializes the connection to the database
        this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);
        const hasProductTable = await this.__hasProductTable();
        const hasCustomerTable = await this.__hasCustomerTable();
        const hasInvoiceTable = await this.__hasInvoiceTable();

        if (hasProductTable) {
            this.ready = Promise.resolve();
            // Create Product table if it hasn't been created
        } else {
            console.log("Product Table: come here")
            const query = `CREATE TABLE ${this.productTableName} (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, productId VARCHAR(511) NOT NULL, productDescription VARCHAR(511) NOT NULL, productTitle VARCHAR(255) NOT NULL)`;
            // Tell the various CRUD methods that they can execute
            this.ready = await this.__query(query)
            console.log(query)
        }

        if ( hasCustomerTable) {
            this.ready = Promise.resolve();
            // Create Product table if it hasn't been created
        } else {
            console.log("Customer Table : come here")
            const query_customer = `CREATE TABLE ${this.customerTableName} (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, customerId VARCHAR(511) NOT NULL, name VARCHAR(511) NOT NULL, email VARCHAR(255) NOT NULL)`;
            // Tell the various CRUD methods that they can execute
            this.ready = await this.__query(query_customer)
            console.log("Query customer: ",query_customer)
        }
        if (hasInvoiceTable) {
            this.ready = Promise.resolve();
            // Create Product table if it hasn't been created
        } else {
            const query = `CREATE TABLE ${this.invoiceTableName} (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, productId VARCHAR(511) NOT NULL, productDescription VARCHAR(511) NOT NULL, productTitle VARCHAR(255) NOT NULL,productPrice VARCHAR(255) NOT NULL,companyName VARCHAR(255) NOT NULL,companyAddress VARCHAR(255) NOT NULL,companyEmail VARCHAR(255) NOT NULL,companyCity VARCHAR(255) NOT NULL,companyCountry VARCHAR(255) NOT NULL,customerId VARCHAR(255) NOT NULL,customerName VARCHAR(255) NOT NULL,customerEmail VARCHAR(255) NOT NULL,customerCity VARCHAR(255) NOT NULL,customerAddress VARCHAR(255) NOT NULL,quantity VARCHAR(255) NOT NULL,subtotal VARCHAR(255) NOT NULL,total VARCHAR(255) NOT NULL)`;
            // Tell the various CRUD methods that they can execute
            this.ready = await this.__query(query)
            console.log(query)
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



