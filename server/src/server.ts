// 초기 셋팅
import express from 'express'
import morgan from 'morgan'
import { AppDataSource } from "./data-source"

const app = express()

app.use(express.json())
app.use(morgan("dev"))

app.get("/",(_,res) => res.send("running"))

let port = 4000

app.listen(port, async()=>{
    console.log(`${port}연결성공`)

    AppDataSource.initialize().then(() => {

        console.log("database initialized")
    
    }).catch(error => console.log(error))
    
})
