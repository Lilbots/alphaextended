const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const db = require('quick.db');
const port = process.env.PORT || 3000;
app.set('port', port);

app.get('/', (req, res) => {
    res.render('index.ejs', { title: 'Alpha Extended', servercount: db.get('servercount') })
})
app.use(express.static('static'))

app.get('/ping', (req, res) => {
    console.log(new Date() + 'Ping!');
    res.status(200).send('Ping!');
})

app.get('/subscriptions', (req, res) => {
    res.render('sub.ejs', { title: 'Alpha Extended', servercount: `${db.get('servercount')}`, channelscount: `${db.get('channelscount')}`, userscount: `${db.get('usercount')}` });
})

app.get('/home', (req, res) => {
    res.render('index.ejs', { title: 'Alpha Extended', servercount: `${db.get('servercount')}`, channelscount: `${db.get('channelscount')}`, userscount: `${db.get('usercount')}` });
    console.log(db.get('servercount'));
    // res.redirect('/');
})

app.get('/commands', (req, res) => {
    res.render('commands.ejs', { title: 'Alpha Extended', servercout: db.get('servercount') });
    // res.redirect('/');
})

app.get('/commands/premium', (req, res) => {
    res.render('commandspre.ejs', { title: 'Alpha Extended', servercout: db.get('servercount') });
})


module.exports = client => {
    app.get('/', (req, res) => {
        let guilds = client.guilds.cache.size;
        req.guilds = guilds;
    });
}

app.listen(port);