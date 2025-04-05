const express=require('express');
const app=express();        // create an express app

app.get('/api',(req,res)=>{
    res.json({"users":['user1','user2','user3']});
});

app.listen(3000,()=>{console.log("Server started  on port 3000  ")})  // server listens on port 3000