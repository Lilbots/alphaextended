const Discord = require('discord.js')

module.exports.run = async(client, message, args, prefix) => {
    if (message.author.id == "690733972883243008") {
        message.author.send(({ files: [{ attachment: './json.sqlite' }] }));
    }
}

module.exports.help = {
    name: "dbcheck",
    aliases: [""]
}