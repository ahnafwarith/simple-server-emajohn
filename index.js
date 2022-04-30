const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config()
// middleware
app.use(cors());
app.use(express.json());

// connect mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b2hlo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('emaJohn').collection('product')
        app.get('/product', async (req, res) => {
            console.log(req.query)
            const size = parseInt(req.query.size);
            const page = parseInt(req.query.page);
            const query = {};
            const cursor = productsCollection.find(query);
            let products;
            if (size || page) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                // const query = {};
                // const cursor = productsCollection.find(query);
                // const products = await cursor.toArray();
            }
            res.send(products);
        })

        app.get('/productCount', async (req, res) => {
            const count = await productsCollection.estimatedDocumentCount();
            res.send({ count });
        })

        // use post to get products by ids
        app.post('/productByKeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id));
            const query = { _id: { $in: ids } }
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            console.log(keys);
            res.send(products);
        })

    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Coding with node')
})

app.listen(port, () => {
    console.log('listening quietly to port', port)
})