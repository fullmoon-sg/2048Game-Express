const express = require('express');
const cors = require('cors');
const MongoUtil = require('./MongoUtil.js')
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();

const app = express();
app.use(cors())


app.use(express.static('public'));
app.use(express.urlencoded({extended:false}))
app.use(express.json())

async function main(){

const MONGO_URL = process.env.MONGO_URL;
await MongoUtil.connect(MONGO_URL,'2048_Game');
let db= MongoUtil.getDB();

app.get('/', async (req,res) => {
    let hall_of_fame = await db.collection('Hall_of_Fame').find().toArray();
    res.json(hall_of_fame)
})

app.post('/', async(req,res) => {
    let {name,score} = req.body;
    let results = await db.collection('Hall_of_Fame').insertOne({name,score});
    res.send({'insertid':results.insertid})
})


app.get('/add', async (req,res) => {
    let playersRecord = await db.collection('Players_Record').find().toArray();
    res.json(playersRecord)
})

app.post('/add', async(req,res) => {
    let {name,password} = req.body;
    let results = await db.collection('Players_Record').insertOne({name,password});
    res.send({'insertid':results.insertid})
})

app.delete('/:id', async (req,res) => {
    let db=MongoUtil.getDB();
    await db.collection('Hall_of_Fame').deleteOne({
        _id: ObjectId(req.params.id)
    })
    res.send({
        'status' :'OK'
    })
})

app.delete('/add/:id', async (req,res) => {
    let db=MongoUtil.getDB();
    await db.collection('Players_Record').deleteOne({
        _id: ObjectId(req.params.id)
    })
    res.send({
        'status' :'OK'
    })
})

}// end of main
main();

app.listen(process.env.PORT, () => {
    console.log("Express is running")
})