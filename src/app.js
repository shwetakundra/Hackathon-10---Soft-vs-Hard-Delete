const express = require('express');
const Student = require('./models/Student');


const app = express();

// middleware 
app.use(express.json());

// Routes

// Get all the students
app.get('/students', async (req, res) => {
    res.send(await Student.find({isDeleted:false}))
})

// Add student to database
app.post('/students', async (req, res) =>{
    const body=req.body;
    const newStudent=Student(body)
    res.send(await newStudent.save())
    
})

// Get specific student
app.get('/students/:id', async (req, res) =>{
    try{
        const  givenId=await Student.findOne({
            _id:req.params.id,
            isDeleted:false
        })
        if(givenId!=null && givenId!=undefined){
            res.send(givenId);
        }else{
            res.sendStatus(404)
        }
    }catch(er){
        res.sendStatus(404);

    }
})

// delete specific student
app.delete('/students/:id', async (req, res) =>{
    if(req.query.type.toLowerCase()==="soft"){
        await Student.updateOne({_id:req.params.id},{isDeleted:true})
    }else if(req.query.type.toLocaleLowerCase()==="hard"){
        await Student.deleteOne({_id:req.params.id})
    }
    res.sendStatus(200);
}) 


module.exports = app;
