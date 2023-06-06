import sqlite3 from "sqlite3";
import path from "path";

const DEFAULT_DB_FILE = path.join(process.cwd(), "database.sqlite");

export const OrdersDB = {
    orderTableName: 'Order',
    db: null,
    ready: null,

    create: async function ({
                                orderId,
                                orderName,
                                customerId,
                                customerFirstName,
                                customerLastName,
                                shippingAddress,
                                productId,
                                productTitle,
                                productPrice,
                                productQuantity,
                                productTotal,
                                tax,
                                discount,
                                subTotal,
                                total,
                            }
    ) {
        await this.ready;
        const query =
            `INSERT INTO ${this.productTableName} (orderId,orderName,customerId,customerFirstName,customerLastName,shippingAddress,productId,productTitle,productPrice,productQuantity,productTotal,tax,discount,subTotal,total) 
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) RETURNING id`;
        const rawResults = await this.__query(query, [
            orderId,
            orderName,
            customerId,
            customerFirstName,
            customerLastName,
            shippingAddress,
            productId,
            productTitle,
            productPrice,
            productQuantity,
            productTotal,
            tax,
            discount,
            subTotal,
            total
        ]);
        return rawResults[0].id;
    },

    update: async function (
        {
            productId,
            productDescription,
            productTitle,
        }
    ) {
        await this.ready;
        const query = `
            UPDATE ${this.orderTableName}
            SET orderId =?,
                orderName=?,
                customerId=?,
                customerFirstName=?,
                customerLastName=?,
                shippingAddress=?,
                productId=?,
                productTitle=?,
                productPrice=?,
                productQuantity=?,
                productTotal=?,
                tax=?,
                discount=?,
                subTotal=?,
                total=?
                WHERE
                    Id = ?
        `;
        await this.__query(query, [
            orderId,
            orderName,
            customerId,
            customerFirstName,
            customerLastName,
            shippingAddress,
            productId,
            productTitle,
            productPrice,
            productQuantity,
            productTotal,
            tax,
            discount,
            subTotal,
            total
        ])
        return true;
    },
    list: async function () {
        await this.ready;
        const query = `
            SELECT *
            FROM ${this.orderTableName}
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
        const query = `SELECT * FROM ${this.orderTableName} WHERE id = ?`
        const rows = await this.__query(query, [id]);
        // Look up for this
        if (!Array.isArray(rows) || rows?.length !== 1) return undefined;
        return rows[0]
    },
    findOrderById: async function (orderId) {
        // await this.init();
        await this.ready;
        const query = `SELECT * FROM ${this.orderTableName} WHERE orderId = ?`
        const rows = await this.__query(query,[orderId]);
        if(!Array.isArray(rows) || rows?.length !== 1) return undefined;
        return rows[0]

    },
    delete: async function (orderId) {
        await this.ready;
        const query = `
            DELETE
            FROM ${this.orderTableName}
            WHERE orderId = ?`;
        await this.__query(query, [orderId])
        return true;
    },


    __hasOrderTable: async function () {
        const query = `;
            SELECT name FROM sqlite_schema
            WHERE
                type = 'table' AND
                name = ?;
        `;
        const rows = await this.__query(query, [this.orderTableName]);
        return rows.length === 1;
    },
    // Initializes the connection with the app's sqlite3 database'
    init: async function () {
        // Initializes the connection to the database
        this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);
        const hasOrderTable = await this.__hasOrderTable();

        if (hasOrderTable) {
            this.ready = Promise.resolve();
            // Create Order table if it hasn't been created
        } else {
            console.log("come here")
            const query =`CREATE TABLE ${this.orderTableName} (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, orderId VARCHAR(511) NOT NULL, orderName VARCHAR(511) NOT NULL, customerFirstName VARCHAR(255) NOT NULL, customerLastName VARCHAR(511) NOT NULL, shippingAddress VARCHAR(511) NOT NULL, productId VARCHAR(511) NOT NULL, productTitle VARCHAR(511) NOT NULL, productPrice VARCHAR(511) NOT NULL, productQuantity VARCHAR(511) NOT NULL, productTotal VARCHAR(511) NOT NULL, tax VARCHAR(511) NOT NULL,discount VARCHAR(511) NOT NULL, subTotal VARCHAR(511) NOT NULL, total VARCHAR(511) NOT NULL,)`;
            console.log("before query")
            // Tell the various CRUD methods that they can execute
            // this.ready = await this.__query(query)
            // console.log("after query: ",query)
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
                })
            } catch (e) {
                console.log(e)
            }
        });
    },


}



