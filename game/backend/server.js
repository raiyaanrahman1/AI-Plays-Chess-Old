const express = require('express'), app = express();
const cors = require('cors');
const fs = require('fs');

require('dotenv').config();

app.use(express.json());
app.use(cors());


app.get('/api/', (req, res) => {
    res.json({
        "hello": ["ben", "bob"]
    });
});

app.post('/api/', (req, res) => {
    
    fs.writeFile('./tree.json', JSON.stringify(req.body), function (err) {
        if (err) console.log(err);
        else console.log('Saved!');
    });
    res.status(201).send(req.body);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("listening on port " + PORT);
})