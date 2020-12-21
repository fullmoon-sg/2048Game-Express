const express = require('express');
const cors = require('cors');
const MongoUtil = require('./MongoUtil.js')
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();

const app = express();
app.use(cors())

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}))

async function main(){

const MONGO_URL = process.env.MONGO_URL;
await MongoUtil.connect(MONGO_URL,'2048_Game');
let db= MongoUtil.getDB();

app.get('/', async (req,res) => {
    let hall_of_fame = await db.collection('Hall_of_Fame').find().toArray();
    res.json(hall_of_fame)
})
}

main();

app.listen(3000, () => {
    console.log("Express is running")
})