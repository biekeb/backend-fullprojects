const express = require('express');
const fs = require('fs/promises');
const cors = require('cors')
const bodyParser = require('body-parser');
const { MongoClient} = require("mongodb");
const config = require('./config.json');


const client = new MongoClient(config.finalurl);


const app = express();
const port = process.env.port || 1334;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors())
app.use(express.json())


//route root
app.get('/', (req, res) => {
    res.status(300).redirect('/info.html');
});



//return all topstukken
app.get('/topstukken', async (req, res) => {
     try {
        //connect to db
        await client.connect();
        const colli = client.db('full-projects-3').collection('topstukken')

        //send back the file
        const ncs = await colli.find({}).toArray();
        res.status(200).send(ncs);

        //catching errors
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'oops',
            value: error
        });
    } finally {
        await client.close();
    }
});

//return one topstuk
app.get('/topstuk', async (req, res) => {
     try {
        //connect to database
        await client.connect();
        const colli = client.db('full-projects-3').collection('topstukken')

        const query = {
            idnc: req.query.id
        };

        const nc = await colli.findOne(query);

        if (nc) {
            res.status(200).send(nc);
            return;
        } else {
            res.status(400).send('nc cannot be found with id: ' + req.query.id);
        }

    } catch (error) {
        res.status(500).send({
            error: 'oops',
            value: error
        });
    } finally {
        await client.close();
    }
});


app.listen(port, () => {
    console.log(`api is running at http://localhost:${port}`);

})
