const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

console.log(process.env.DB_USER)

app.get('/', (req, res) => {
  res.send('Hi, I am Samrat!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpdhc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('Connection Error', err)
  const productCollection = client.db("dukanghorShop").collection("products");

  app.get('/products', (req, res) => {
      productCollection.find()
      .toArray((err, items) =>{
          res.send(items)
      })
  })

  app.get('/products/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    productCollection.find(id)
    .toArray((err, items) =>{
        res.send(items[0])
    })
})
  
  
  app.post('/addProduct', (req, res) => {
      const newProduct = req.body;
      console.log('Adding New Product', newProduct);
      productCollection.insertOne(newProduct)
      .then(result => {
          console.log('inserted Count',result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })

  app.delete('/products/:id' ,(req, res) => {
    productCollection.deleteOne({ _id : ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })

  //   client.close();
});


app.listen(port)