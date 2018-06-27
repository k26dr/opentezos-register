var fs = require('fs');
const express = require('express')
const https = require('https');
const app = express()
const morgan = require('morgan')
const rp = require('request-promise');
const path = require('path');

// Logging
app.use(morgan('combined'))

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/register/:pubkey', (req, res) => {
    var pubkey = req.params.pubkey;
    console.log(pubkey);
    rp.get(`https://check.tezos.com/${pubkey}.json`)
        .then(function (resp) {
            var balance = JSON.parse(resp).allocated_tezzies + '\n';
            fs.writeFileSync(`data/${pubkey}`, balance);
            res.send(balance);
        })
        .catch(function (err) {
            res.status(500);
            console.error("Tezos pubkey not found");
            res.send(`Tezos pubkey ${pubkey} not found`);
        });
});

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/img/:file', (req, res) => {
   res.sendFile(path.join(__dirname, "img", req.params.file));
});

https.createServer({
    key: fs.readFileSync('certs/privkey1.pem'),
    cert: fs.readFileSync('certs/cert1.pem')
}, app).listen(443, '0.0.0.0');
