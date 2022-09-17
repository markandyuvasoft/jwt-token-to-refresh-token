import express from 'express'
import * as path from 'path'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import indexrouter from './routes/index.js'

const app=express()

app.use(morgan('dev'))

 
app.use(express.json())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))



app.use("/",indexrouter)


app.listen(3000)

console.log("http://localhost:3000");

