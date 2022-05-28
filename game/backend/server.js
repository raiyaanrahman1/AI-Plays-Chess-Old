const express = require('express'), app = express();
const cors = require('cors');
const fs = require('fs');

require('dotenv').config();

//app.use(express.json({limit: '1gb'}));
app.use(express.text({limit: "1gb"}));
app.use(cors());


app.get('/api/', (req, res) => {
    res.json({
        "hello": ["ben", "bob"]
    });
});

app.post('/api/', (req, res) => {
    //console.log(req.body);
    res.status(201).send(req.body);
    
    fs.writeFile('./backend/tree.json', req.body, function (err) {
        if (err) console.log(err);
        else console.log('Saved!');
    });
    
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("listening on port " + PORT);
})