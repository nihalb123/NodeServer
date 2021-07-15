
const express = require("express");
const path = require('path');
var bodyParser=require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));


const { MongoClient } = require('mongodb');

 async function addUser(name, password)
{
    const uri = "mongodb+srv://NbAdmin:LiGpX8syZa3MMk8w@clusternine.v5ifg.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology:true});
    const user = {"name":name, "password":password};
    try 
    {
        await client.connect();
        const res = await client.db("TestDb").collection("UserInfo").insertOne(user);
        console.log(res.insertedIds);
    } 
    catch (error) 
    {
        console.error(error);
    }
    finally {
        await client.close();
    }     
}

async function verifyUser(name,password)
{
    const uri = "mongodb+srv://NbAdmin:LiGpX8syZa3MMk8w@clusternine.v5ifg.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology:true});
    const user = {"name":name, "password":password};
    try 
    {
        await client.connect();
        const res = await client.db("TestDb").collection("UserInfo").findOne(user);
        if(res!==null)
        {
            return true;
        }
        else
        {
            return false;
        }
    } 
    catch (error) 
    {
        console.error(error);
    }
    finally {
        await client.close();
    }   
}

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/login.html`);
});

app.post('/sign_up', async function(req,res){
    var name = req.body.name;
    var pass = req.body.password;
  
    var data = {
        "name": name,
        "password":pass,
    }
        await addUser(data.name, data.password);
        console.log("Record inserted Successfully");
                 
    res.send("Successful!");
});

app.post('/login', async function(req,res){
    var name = req.body.name;
    var pass = req.body.password;
  
    var data = {
        "name": name,
        "password":pass,
    }

    const result = await verifyUser(data.name, data.password);
        if(result)
        {
            res.send("Successful!");
        }
        else
        {
            res.send("Not a user!");
        }  
    
});
  
app.get("/userLogin.js", (req, res) => {
    res.sendFile(`${__dirname}/userLogin.js`);
});

app.listen(3000,()=> {console.log("Listening on 3000");});

