const express = require("express");
const connectDb = require("./config/db");
require("dotenv").config({ path: "./config/config.env" });
const Worker = require("./models/worker");
const Manager = require("./models/manager");
const Request = require("./models/requests");


const  app = express();

// connect db

connectDb();

//  body parser

app.use(express.json());
app.use(express.urlencoded({extended: true}));


//  MANAGERS SIDE
//  ADD MANAGER  TO DB

app.post("/api/v1/managers", async (req, res) => {
    // console.log(req.body);
    const manager = await Manager.create(req.body);
    if(!manager) {
        res.status(400).json({error: "error while creating employee"});
    }
    res.json({
        data: manager
    })
})

//  GET  INFO OF MANAGER WITH HIS ID

app.get("/api/v1/managers/:id", async (req, res) => {
    const manager = await Manager.findById(req.params.id);
    if(!manager) {
        res.status(401).json({error: "no manager found"});
    }
    res.status(200).json({
        data: manager
    })
})

//  GET ALL HOLIDAY REQUESTS TO MANAGER 

app.get("/api/v1/managers/:mid/requests", async (req, res) => {
    const requests = await Request.find();
    res.status(200).json({
        data: requests
    })
})

//  UPDATE THE REQUEST OF EMPLOYEE

app.put("/api/v1/managers/:mid/requests/:id", async (req, res) => {
    const request = await Request.findById(req.params.id);
    if(!request) {
        res.status(400).json({error: "no request found"});
    }
    const updated = {...req.body, resolvedBy: req.params.mid}
    await Request.findOneAndUpdate(request.id, updated);
    res.status(200).json({
        data: updated
    })
})

//  WORKERS SIDE
//  ADD NEW WORKER TO THE DB

app.post("/api/v1/workers", async (req, res) => {
    // console.log(req.body);
    const worker = await Worker.create(req.body);
    if(!worker) {
        res.status(400).json({error: "error while creating employee"});
    }
    res.json({
        data: worker
    })
})

//  CREATE NEW REQUEST 

app.post("/api/v1/workers/:id/requests", async (req, res) => {
    console.log(req.body);
    const worker = await Worker.findById(req.params.id);
    if(!worker) {
        res.status(401).json({error: "no employee found"});
    }

    const date1 = new Date(req.body.vacationEndDate);
    const date2 = new Date(req.body.vacationStartDate);
    


    
    // To calculate the time difference of two dates 
    const Difference_In_Time = date1.getTime() - date2.getTime(); 
    
    // To calculate the no. of days between two dates 
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 

    if(worker.holidays < Difference_In_Days) {
        res.status(400).json({
            error: "you dont have enough holidays to get more holidays"
        })
    }

    await Worker.findOneAndUpdate(worker.id, { $inc: { holidays: -Difference_In_Days}});

    const request = await Request.create({...req.body, auther: req.params.id});
    if(!request) {
        res.status(400).json({error: "error while creating employee request"});
    }
    res.json({
        data: request
    })
})

//  GET  EMPLOYEE INFO WITH HIS ID

app.get("/api/v1/workers/:id", async (req, res) => {
    const worker = await Worker.findById(req.params.id);
    if(!worker) {
        res.status(401).json({error: "no employee found"});
    }
    res.status(200).json({
        data: worker
    })
})


app.listen(5000, ()=> "server is listening on 5000");