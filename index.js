const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

//set the middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwh5y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("bookingService");
        const serviceCollection = database.collection("services");
        const blogCollection = database.collection("blogs");
        const offerCollection = database.collection("offers");

        //GET THE API 
        app.get("/services", async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        //GET THE BLOGS API 
        app.get("/blogs", async (req, res) => {
            const cursor = blogCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        //GET THE OFFERS API 
        app.get("/offers", async (req, res) => {
            const cursor = offerCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // single details --------------------->
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        });
        //--------------------->

        // POST THE API TO MONGO-DB
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post', service);
            const result = await serviceCollection.insertOne(service)
            console.log(result);
            res.send(result);
        });

        //UPDATE API
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updatedplace = req.body;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true };

            const updateDoc = {
                $set: {
                    name: updatedplace.name,
                    price: updatedplace.price
                },
            };
            const result = await serviceCollection.updateOne(filter, updateDoc, option);

            res.json(result);

        })


        // DELET API
        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            console.log("deleting user id ", result);
            res.json(result);
        });


    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('BD tour is running...')
})

app.listen(port, () => {
    console.log(`BD tour app is listening at http://localhost:${port}`)
})