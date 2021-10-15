"use strict";

import pg from 'pg'

const {Pool} = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
})

const run = async() => {
    const jobId = process.env.RENDER_INSTANCE_ID.substring(0,24)
    const userQuery = unescape(process.argv.slice(2)[0])
    const userResponse = await pool.query(userQuery)
    await pool.query('insert into query_results(job_id, response) VALUES($1, $2)', [jobId, {responseData: userResponse.rows}])
    process.exit(0)
}

run()