import Knex from 'knex';

const knex = Knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'root',
    password: 'password',
    database: 'wb-test'
  },
  pool: { min: 0, max: 7 },
  acquireConnectionTimeout: 10000,
});

async function testConnection(): Promise<void> {
  try {
    const result = await knex.raw('SELECT 1');
    console.log('Подключение успешно:', result);
  } catch (error) {
    console.error('Ошибка подключения:', error);
  } finally {
    await knex.destroy();
  }
}

testConnection();