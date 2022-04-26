const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors")
// furkan
// yN4AFUIJDAPozuMJ
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://furkan:yN4AFUIJDAPozuMJ@cluster0.rzgni.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const notesCollection = client.db("notesTaker").collection("notes");

        // get api to read all notes
        // http://localhost:4000/notes
        app.get('/notes', async (req, res) => {
            const q = req.query;
            // console.log(q);

            const cursor = notesCollection.find(q);

            const result = await cursor.toArray();

            res.send(result)
        })

        // create notesTaker
        // http://localhost:4000/note

        /*
        body{
            "userName":"Ikbal Farooqi",
            "textData":"hello Earth"
        }
        */


        app.post('/note', async (req, res) => {
            const data = req.body
            // console.log(data);

            const result = await notesCollection.insertOne(data)

            res.send(result)
        })


        // update noteTaker
        // http://localhost:4000/note/62667b57fc695bc86dc9661d
        app.put('/note/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log('from update api', data)

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    // ...data
                    userName: data.userName, textData: data.textData
                },
            };
            const result = await notesCollection.updateOne(filter, updateDoc, options);

            res.send(result);


            // console.log('from put method', id)

        })


        // delete note
        // http://localhost:4000/note/62667b57fc695bc86dc9661d
        app.delete('/note/:id', async (req, res) => {

            const id = req.params.id;
            const filter = { _id: ObjectId(id) };

            const result = await notesCollection.deleteOne(filter);
            res.send(result)
        })


        console.log('conected> to db')
    }
    finally {

    }
}

run().catch(console.dir)








app.get('/', (req, res) => {


    res.send("hello world");
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})