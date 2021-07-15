const { MongoClient } = require('mongodb');

async function main()
{
    const uri = "mongodb+srv://NbAdmin:LiGpX8syZa3MMk8w@clusternine.v5ifg.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology:true});

    try 
    {
        await client.connect();

        await listDatabases(client);  
    } 
    catch (error) 
    {
        console.error(error);
    }
    finally {
        await client.close();
    }     
}

main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};