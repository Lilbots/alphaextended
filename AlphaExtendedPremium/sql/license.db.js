var mysql = require('mysql');
const { name, user, port, host } = require('./dbconfig.json')
var connection = mysql.createConnection({
    host: host,
    user: user,
    password: ">@8K\YfD==xHrfQZ",
    database: name,
    port: port
});



connection.connect((err) => {
    if (err) throw err;

    console.log('Connected')
});

connection.query(`INSERT INTO premium (id) VALUES (${IDpr()})`, function(error, results, fields) {
    if (error) throw error;
    console.log(results);
});

connection.end();

function IDpr() {
    let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-pr-' + s4() + '-pr-' + s4() + '-pr-' + s4() + '-pr-' + s4() + s4() + s4();
}

function IDpl() {
    let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-pl-' + s4() + '-pl-' + s4() + '-pl-' + s4() + '-pl-' + s4() + s4() + s4();
}