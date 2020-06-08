const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const db = require('quick.db');
const port = process.env.PORT || 3000;
const license = require('./AlphaExtendedPremium/licenseGen');
const paypal = require('paypal-rest-sdk');
const { api } = require('./pconfig.json');
const url = require('url');
const fs = require('fs');

const patreon = require('patreon');
const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;
const CLIENT_ID = 'erMsw4_VgJzuI77gn69POpBwVPmuUF2mLTGgzOogjPLuEo-9A3fVtv6PsG7rZYIT';
const CLIENT_SECRET = '8w-vXoZO6bnaVCtYqOpPGyTCbDQ-CNKzHVxVgLbh94DpvxBhZVNtpWHMZulPMoR2';
const patreonOAuthClient = patreonOAuth(CLIENT_ID, CLIENT_SECRET);
const redirectURL = 'patreon.com/oauth2/authorize';

paypal.configure({
    "mode": "live",
    "client_id": "ATZaNyfplkNva8TS1lhUtvAeW-zTyVu_dZsInm_cJn2-LjpAxF_4NIMXWk5Q7HQbQEDGoO3RPUSuC5sm",
    "client_secret": "EO2YR6nHAnBLR1SDfdz3PEYh_RWOleg4Uu3K4QbvaMsoEONtOc_D9F8z1YwQfh-RZcGAWhh2ujlSgYfk"
});
/

app.get('/', (req, res) => {
    const hash = req.url.split('?')[1];
    if (hash) {
        if (hash === ids) {
            if (type === "premium") {
                console.log('premium');
                const id = license.genPremium();
                res.render('premium.ejs', { title: 'Alpha Extended', license: id });
                ids = "";
                type = "";
            } else if (type === "platinium") {
                console.log('platinium');
                const id = license.genPremium();
                res.render('platinium.ejs', { title: 'Alpha Extended', license: id });
                ids = "";
                type = "";
            }
        } else {
            res.render('index.ejs', { title: 'Alpha Extended', servercount: `${db.get('servercount')}`, channelscount: `${db.get('channelscount')}`, userscount: `${db.get('usercount')}` })
        }
    } else {
        res.render('index.ejs', { title: 'Alpha Extended', servercount: `${db.get('servercount')}`, channelscount: `${db.get('channelscount')}`, userscount: `${db.get('usercount')}` })
    }
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
    res.render('index.ejs', { title: 'Alpha Extended', servercount: `43`, channelscount: `2857`, userscount: `7865` });
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


app.get('/invite', (req, res) => {
    res.redirect('https://bit.ly/2ZTIEvw');
})

let ids = "";
let type = "";
app.get('/buy/premium', (req, res) => {
    var payment = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://" + req.headers.host + "/buy/premium/pp",
            "cancel_url": "http://" + req.headers.host + "/subscriptions"
        },
        "transactions": [{
            "amount": {
                "total": 15.00,
                "currency": "CAD"
            },
            "description": "A premium licence key for Alpha Extended"
        }]
    }

    // call the create Pay method 
    createPay(payment)
        .then((transaction) => {
            var id = transaction.id;
            var links = transaction.links;
            var counter = links.length;
            setId(id, "premium");
            while (counter--) {
                if (links[counter].method == 'REDIRECT') {
                    return res.redirect(links[counter].href);
                }
            }
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/err');
        });
})

function handleOAuthRedirectRequest(request, response) {
    var oauthGrantCode = url.parse(request.url, true).query.code;
    console.log(oauthGrantCode);
    patreonOAuthClient
        .getTokens(oauthGrantCode, redirectURL)
        .then(function(tokensResponse) {
            var patreonAPIClient = patreonAPI(tokensResponse.access_token)
            return patreonAPIClient('/current_user')
        })
        .then(function(result) {
            var store = result.store
                // store is a [JsonApiDataStore](https://github.com/beauby/jsonapi-datastore)
                // You can also ask for result.rawJson if you'd like to work with unparsed data
            response.end(store.findAll('user').map(user => user.serialize()))
        })
        .catch(function(err) {
            console.error('error!', err)
            response.end(err)
        })
}

function setId(_id, _type) {
    ids = _id;
    type = _type;
}

let link = "";
app.get("/buy/premium/pp", (req, res) => {
    console.log(ids);
    if (ids === "") {
        res.redirect('/home')
    } else {
        //link = `/premium/id=${ids}`;
        res.redirect('/?' + ids);
    }
})

app.get('/buy/platinium', (req, res) => {
    var payment = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://" + req.headers.host + "/buy/premium/pp",
            "cancel_url": "http://" + req.headers.host + "/subscriptions"
        },
        "transactions": [{
            "amount": {
                "total": 30.00,
                "currency": "CAD"
            },
            "description": "A platinium licence key for Alpha Extended"
        }]
    }

    // call the create Pay method 
    createPay(payment)
        .then((transaction) => {
            var id = transaction.id;
            var links = transaction.links;
            var counter = links.length;
            setId(id, "platinium");
            while (counter--) {
                if (links[counter].method == 'REDIRECT') {
                    return res.redirect(links[counter].href);
                }
            }
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/err');
        });
})

module.exports = client => {
    app.get('/', (req, res) => {
        let guilds = client.guilds.cache.size;
        req.guilds = guilds;
    });
}


app.listen(port, () => {
    console.log("server launched");
});

var createPay = async(payment) => {
    return new Promise((resolve, reject) => {
        paypal.payment.create(payment, function(err, payment) {
            if (err) {
                reject(err);
            } else {
                resolve(payment);
            }
        });
    });
}
