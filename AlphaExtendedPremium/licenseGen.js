const db = require('quick.db');
module.exports = {
    genPremium: function genPremium() {
        const id = IDpr();
        db.push("licenses.keys.premium", id);
        return id;
    },
    genPlatinium: function genPlatinium() {
        const id = IDpl();
        db.push("licenses.keys.platinium", id);
        return id;
    },

}

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