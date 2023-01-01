const express = require('express');
const cors = require('cors');

const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000


app.use(express.json())
app.use(cors())


app.get('/', async (req, res) => {
    res.send('boibodol portal server is running')
})

// MONGODB  
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwkrobe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        //for all category and its item
        const CategoryList = client.db('BoiBodol').collection('CategoryList')
        const CategoryItems = client.db('BoiBodol').collection('CategoryItems')

        //users collection added
        const usersCollection = client.db('BoiBodol').collection('usersCollection')

        // booking collection added 
        const BookedCollection = client.db('BoiBodol').collection('BookedCollection')

        const DivisionCollection = client.db('BoiBodol').collection('divisions')
        const DistrictsCollection = client.db('BoiBodol').collection('districts')
        const UpazilasCollection = client.db('BoiBodol').collection('upazilas')




        // booking list collection filter by email
        app.get('/bookedList', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const result = await BookedCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/bookedList/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const booking = await BookedCollection.findOne(query)
            res.send(booking)
        })


        app.post('/bookedList', async (req, res) => {
            const user = req.body;
            const result = await BookedCollection.insertOne(user)
            res.send(result)
        })






        // app.get('/search', async (req, res) => {
        //     const query = {}
        //     const result = await CategoryItems.find(query).toArray()
        //     res.send(result)
        // })

        app.get('/search', async (req, res) => {
            const name = req.query.name;
            console.log(name);
            let query = {}
            if (req.query.name) {
                query = {
                    name: { $regex: name, $options: 'i' }
                }
            }
            const result = await CategoryItems.find(query).toArray()
            res.send(result)
        })

        app.get('/products', async (req, res) => {
            const query = {}
            const result = await CategoryItems.find(query).toArray()
            res.send(result)
        })

        app.get('/divisions', async (req, res) => {
            const query = {}
            const result = await DivisionCollection.find(query).toArray()
            res.send(result)
        })

        //for fetching division name by id
        app.get('/division/:id', async (req, res) => {
            const query = { division_id: req.params.id }
            const result = await DivisionCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/districts/:id', async (req, res) => {
            const query = { division_id: req.params.id }
            const result = await DistrictsCollection.find(query).toArray()
            res.send(result)
        })

        //for fetching district name by id
        app.get('/district/:id', async (req, res) => {
            const query = { district_id: req.params.id }
            const result = await DistrictsCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/upazilas/:id', async (req, res) => {
            const query = { district_id: req.params.id }
            const result = await UpazilasCollection.find(query).toArray()
            res.send(result)
        })






        // all products and category api
        app.get('/categorylist', async (req, res) => {
            const query = {}
            const result = await CategoryList.find(query).toArray()
            res.send(result);
        })

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { categoryId: id }
            const result = await CategoryItems.find(query).toArray()
            res.send(result)
        })

        //



        //reported item api
        app.get('/reportedProducts', async (req, res) => {
            const query = { isReported: true }
            const result = await CategoryItems.find(query).toArray()
            res.send(result)
        })



        //report product by id
        app.put("/reportedProducts/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatedDoc = {
                $set: {
                    isReported: true
                }
            }
            const result = await CategoryItems.updateOne(filter, updatedDoc, option);
            res.send(result);
        })

        // reported item deleted from reports 
        app.patch("/reportedProducts/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    isReported: false
                }
            }
            const result = await CategoryItems.updateOne(filter, updatedDoc);
            res.send(result);
        })






        // get user info
        app.get('/users', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const result = await usersCollection.find(query).toArray()
            res.send(result)
        })

        // seller my products api
        app.get('/myproducts', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const result = await CategoryItems.find(query).toArray()
            res.send(result)
        })

        //verify user api
        app.put('/seller/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    verified: true
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })



        //Advertise Handle API
        app.put('/myproducts/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    Advertise: true,
                    verified: true
                }
            }
            const result = await CategoryItems.updateOne(filter, updatedDoc, options)
            res.send(result)
        })


        //Available handle api
        app.patch('/available/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    Available: false
                }
            }
            const result = await CategoryItems.updateOne(filter, updatedDoc)
            res.send(result)
        })



        // delete product api 
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await CategoryItems.deleteOne(query)
            console.log(result)
            res.send(result)
        })



        // delete user api 
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            let query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })


        // add a product api 
        app.post('/categoryitems', async (req, res) => {
            const user = req.body;
            const result = await CategoryItems.insertOne(user)
            res.send(result)
        })

        // add a user api 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })



    } catch (error) {
        console.log(error);
    }
}


run().catch(console.log)





app.listen(port, () => console.log(`boibodol portal is running on ${port}`))