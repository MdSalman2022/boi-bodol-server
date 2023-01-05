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
        const CategoryList = client.db('BoiBodol').collection('categoryCollection')
        const BookCollection = client.db('BoiBodol').collection('BookCollection')

        //users collection added
        const usersCollection = client.db('BoiBodol').collection('usersCollection')

        // booking collection added 
        const wishlistCollection = client.db('BoiBodol').collection('wishlistCollection')

        const DivisionCollection = client.db('BoiBodol').collection('divisions')
        const DistrictsCollection = client.db('BoiBodol').collection('districts')
        const UpazilasCollection = client.db('BoiBodol').collection('upazilas')




        // booking list collection filter by email
        app.get('/wishlist', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const result = await wishlistCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/wishlist/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const booking = await wishlistCollection.findOne(query)
            res.send(booking)
        })


        app.post('/wishlist', async (req, res) => {
            const user = req.body;
            const result = await wishlistCollection.insertOne(user)
            res.send(result)
        })






        // app.get('/search', async (req, res) => {
        //     const query = {}
        //     const result = await CategoryItems.find(query).toArray()
        //     res.send(result)
        // })

        app.get('/search', async (req, res) => {
            const name = req.query.name;
            let query = {}
            if (req.query.name) {
                query = {
                    name: { $regex: name, $options: 'i' }
                }
            }
            const result = await BookCollection.find(query).toArray()
            res.send(result)
        })

        /*
        ! for fetching all books name 
        */
        app.get('/products', async (req, res) => {
            const query = {}
            const result = await BookCollection.find(query).toArray()
            res.send(result)
        })

        /*
        ! for fetching all books name 
        */
        app.get('/trending', async (req, res) => {
            const query = { trending: true }
            const result = await BookCollection.find(query).toArray()
            res.send(result)
        })

        /*
        ! for fetching all books name by id 
        */
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await BookCollection.find(query).toArray()
            res.send(result)
        })
        /* 
        ! for fetching category books name by id  
        */
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { categoryId: id }
            const result = await BookCollection.find(query).toArray()
            res.send(result)
        })


        // all products and category api
        app.get('/catagories', async (req, res) => {
            const query = {}
            const result = await CategoryList.find(query).toArray()
            res.send(result);
        })





        /* 
        ! show 3 books in home page  
        */
        app.get('/homebooks', async (req, res) => {
            const query = {}
            const cursor = BookCollection.find(query)
            const result = await cursor.limit(4).toArray()
            res.send(result)
        })

        app.get('/divisions', async (req, res) => {
            const query = {}
            const result = await DivisionCollection.find(query).toArray()
            res.send(result)
        })

        /* 
        ! for fetching division name by id 
        */
        app.get('/division/:id', async (req, res) => {
            const query = { division_id: req.params.id }
            const result = await DivisionCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/districts', async (req, res) => {
            const query = {}
            const result = await DistrictsCollection.find(query).toArray()
            res.send(result)
        })

        /*
        ! for fetching districts name by id 
        */
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

        /*
        ! for fetching upazilas by id 
        */
        app.get('/upazilas', async (req, res) => {
            const query = {}
            const result = await UpazilasCollection.find(query).toArray()
            res.send(result)
        })



        app.get('/upazilas/:id', async (req, res) => {
            const query = { district_id: req.params.id }
            const result = await UpazilasCollection.find(query).toArray()
            res.send(result)
        })






        /* 
        ! get user info 
        */
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

        /*
        ! individual seller my products api 
        */
        app.get('/myproducts', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const result = await BookCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/allproducts', async (req, res) => {
            let query = {}
            const result = await BookCollection.find(query).toArray()
            res.send(result)
        })


        /*
        ! get product by id
        */
        app.get('/myproducts/:id', async (req, res) => {
            let query = { _id: ObjectId(req.params.id) }
            const result = await BookCollection.find(query).toArray()
            res.send(result)
        })

        //verify user api
        // app.put('/seller/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) }
        //     const options = { upsert: true }
        //     const updatedDoc = {
        //         $set: {
        //             verified: true
        //         }
        //     }
        //     const result = await usersCollection.updateOne(filter, updatedDoc, options)
        //     res.send(result)
        // })



        /* 
        ! Sold Handle API 
        */
        app.put('/myproducts/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    sold: true
                }
            }
            const result = await BookCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })




        /* 
        ! delete product api  
        */
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await BookCollection.deleteOne(query)
            res.send(result)
        })


        /* 
            ! delete user api for admin 
        */
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            let query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })


        /* 
        ! add a book api  
        */
        app.post('/books', async (req, res) => {
            const user = req.body;
            const result = await BookCollection.insertOne(user)
            res.send(result)
        })

        /* 
        ! add a user api  
        */
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