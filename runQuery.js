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
    const userResponse = await pool.query(process.env.QUERY)
    await pool.query('insert into query_results(job_id, response) VALUES($1, $2)', [jobId, userResponse.rows])
    process.exit(0)
}

run()