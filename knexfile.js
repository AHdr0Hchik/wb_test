export default {
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            port: 5432,
            user: 'root',
            password: 'password',
            database: 'wb-test'
        },
        migrations: {
            extension: "mts",
            directory: "./src/migrations",
        },
        pool: { min: 0, max: 7 },
        acquireConnectionTimeout: 10000,
        tsConfigFilePath: './tsconfig.json'
    }
};