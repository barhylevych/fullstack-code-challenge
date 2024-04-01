module.exports = {
  migrationPattern: 'src/migrations/*',
  driver: 'pg',
  host: process.env.PGSQL_HOST,
  port: process.env.PGSQL_PORT,
  database: process.env.PGSQL_DATABASE,
  username: process.env.PGSQL_USER,
  password: process.env.PGSQL_PASSWORD,
}
