import knex from 'knex';

export const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'root',
        password: 'password',
        database: 'wb-test'
    },
    acquireConnectionTimeout: 10000,
});