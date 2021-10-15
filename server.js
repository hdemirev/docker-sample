"use strict";

import express from 'express'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import pg from 'pg'
import path from 'path'

const {Pool} = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
})

const PORT = 8080;
const HOST = "0.0.0.0";

const app = express();
app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.sendFile(path.resolve('./public.html'))
});

const createJob = async(query) => {
  const response = await fetch(`https://api.staging.render.com/v1/services/${process.env.RENDER_SERVICE_ID}/jobs`, {
    method: 'post',
    body: JSON.stringify({
      startCommand: `QUERY=${query} node runQuery.js`,
      planId: 'plan-srv-007'
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RENDER_API_KEY}`
    }
  });
  const data = await response.json();
  return data
}

const checkJob = async(id) => {
  const response = await fetch(`https://api.staging.render.com/v1/services/${process.env.RENDER_SERVICE_ID}/jobs/${id}`, {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${process.env.RENDER_API_KEY}`
    }
  });
  const data = await response.json();
  return data
}

const getResult = async(jobId) => {
  const res = await pool.query('select * from query_results where job_id = $1', [jobId])
  if(res.rows.length > 0){
    return res.rows[0].response
  } else {
    return null
  }
}

app.post("/new-request", async(req, res) => {
  const query = req.body.query
  const data = await createJob(query)
  console.log('created job', data.id)
  res.json({jobId: data.id})
});

app.get("/check-request", async(req, res) => {
  const jobId = req.query.id
  const job = await checkJob(jobId)
  let result = null
  if(job.status === "succeeded"){
    result = await getResult(jobId)
  }
  res.json({
    ...job, 
    result
  })
});

app.listen(PORT, HOST);
console.log('app running')