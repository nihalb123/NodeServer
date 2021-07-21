
const express = require("express");
var bodyParser=require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
const mongoUri = "Replace with mongo uri";

// app.use(bodyParser.urlencoded({
//     extended: true
// }));

const auth = require("./auth_3.js");
const { MongoClient } = require('mongodb');

 async function addUser(name, password)
{
    const client = new MongoClient(mongoUri, {useNewUrlParser: true, useUnifiedTopology:true});
    
    try 
    {
        await client.connect();
        let newPassword = await auth.getPasswordHash(password);
        let user = {"name":name, "password":newPassword};
        const res = await client.db("TestDb").collection("UserInfo").insertOne(user);
        return true;
    } 
    catch (error) 
    {
        console.error(error);
        return false;
    }
    finally {
        await client.close();
    }     
}

async function verifyUser(name,password)
{
    const client = new MongoClient(mongoUri, {useNewUrlParser: true, useUnifiedTopology:true});
    try 
    {
        await client.connect();
        
        let user = {"name":name};
        const res = await client.db("TestDb").collection("UserInfo").findOne(user);
        if(res!==null)
        {
            const isPasswordCorrect = await auth.isPasswordCorrect(password, res.password);
            return isPasswordCorrect;
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
    let name = req.body.name;
    let pass = req.body.password;
  
        const result = await addUser(name, pass);
        if(result)
        {
            res.send({"success": "User added!"});
        }
        else
        {
            res.send({"error": "Unable to add user"});
        }  
});

app.post('/login', async function(req,res){
    let name = req.body.name;
    let pass = req.body.password;

    const result = await verifyUser(name, pass);
        if(result)
        {
            res.send({"success": "User verified!"});
        }
        else
        {
            res.send({"error": "Not a user"});
        }  
});
  
app.listen(3000,()=> {console.log("Listening on 3000");});

