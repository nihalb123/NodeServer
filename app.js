const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const bodyParser=require("body-parser");
app.use(bodyParser.json());
app.use(express.static(`${__dirname}`));
app.use(cookieParser());

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

async function addSession(name, sessionId)
{
    const client = new MongoClient(mongoUri, {useNewUrlParser: true, useUnifiedTopology:true});
    try 
    {
        await client.connect();
        

        let session = {"name":name, "sessionId":sessionId};
        const res = await client.db("TestDb").collection("SessionInfo").insertOne(session);
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

async function verifySessionId(sessionId)
{
    const client = new MongoClient(mongoUri, {useNewUrlParser: true, useUnifiedTopology:true});
    try 
    {
        await client.connect();
        
        let session = {"sessionId":sessionId};
        const res = await client.db("TestDb").collection("SessionInfo").findOne(session);
        return res;
    } 
    catch (error) 
    {
        console.error(error);
    }
    finally {
        await client.close();
    }   
}

// app.get("/", async function(req, res) {
//     let sessionId = req.cookies.SessionId;
//     if(sessionId)
//     {
//         const result = await verifySessionId(sessionId);
//         if(result!==null)
//         {

//             res.send(`Hi, ${result.name} you are already logged in!`)
//         }
//         else
//         {
//             res.sendFile(`${__dirname}/login.html`);
//         }
//     }
//     else
//     {
//         res.sendFile(`${__dirname}/login.html`);
//     }
    
// });

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
            let sessionId = generateRandomNumber(name);
            const sessionRes = await addSession(name, sessionId);
            if(sessionRes)
            {
                res.setHeader("set-cookie",[`SessionId = ${sessionId}`])
                res.send({"success": "User added!"});
            }
            else
            {
                res.send({"success": "User added!"});
            }
        }
        else
        {
            res.send({"error": "Not a user"});
        }  
});
  
app.listen(3000,()=> {console.log("Listening on 3000");});

function generateRandomNumber(name)
{
    return name+"12345";
}