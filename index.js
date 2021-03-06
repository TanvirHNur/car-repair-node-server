const express =require('express');
const { MongoClient } = require('mongodb');
const ObjectId =require('mongodb').ObjectId;

const cors= require('cors');
require('dotenv').config();


const app=express();
const port= process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4scxf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){

    try{
        await client.connect();
        const database= client.db('carMechanic');
        const servicesCollection = database.collection('services');



        //POST API  // send data from clientside
        app.post('/services', async (req,res) => {
            
            const service =req.body;
            // console.log('hiiting', service)
            const result= await servicesCollection.insertOne(service);
            // console.log(result)
            res.json(result,'hello')
        });

        //Get all data from db
        app.get('/services', async (req, res)=> {
            const cursor =servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })


        //get single data

        app.get('/services/:id', async (req,res) => {
            const id =req.params.id;
            const query= {_id: ObjectId(id)}
            const service =await servicesCollection.findOne(query);
            res.json(service)
        })

        //delete
        app.delete('/services/:id', async (req,res) => {
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const result= await servicesCollection.deleteOne(query);
            res.json(result)
        });


     


    }
    finally{
        // await client.close();
    };

}

run().catch(console.dir);

   //checking
   app.get('/hello', (req,res) =>{
    res.send('hello, update is here')
})

app.get('/', (req,res)=> {
    console.log('Practice practices')
    res.send('Practice practices')
})

app.listen(port,() => {
    console.log('Running on server', port)
})