const { Console } = require('console');
const { MongoClient } = require('mongodb');


async function main(userName, password)
{
    const uri = "mongodb+srv://NbAdmin:LiGpX8syZa3MMk8w@clusternine.v5ifg.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology:true});

    try 
    {
        await client.connect();
        console.log(`MongoCrud inputs: ${userName} ${password}`);
    } 
    catch (error) 
    {
        console.error(error);
    }
    finally {
        await client.close();
    }     
}

module.exports.main = main;
async function addUsers(client, users)
{
    const res = await client.db("TestDb").collection("UserInfo").insertMany(users);
    console.log(res.insertedIds);
}

async function fetchUserByName(client, userName)
{
    const res = await client.db("TestDb").collection("UserInfo").findOne({"name":userName});
    console.log(res);
}

