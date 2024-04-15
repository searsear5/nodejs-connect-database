const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const pool = new Pool({
    //user: 'jdrlbkep',
    // host: 'rosie.db.elephantsql.com',
    // database: 'jdrlbkep',
    // password: 'YAOS8egc7lyD4pxy3i9GcMfxZegULXUS',
    // port: 5432,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,

})

module.exports = pool