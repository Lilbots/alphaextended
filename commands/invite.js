const Discord = require('discord.js')

module.exports.run = async(client, message, args, prefix) => {
    let embed = new Discord.MessageEmbed()
        .setTitle(`Invite`)
        .setDescription("Click [invite](https://bit.ly/2ZTIEvw) to add me to your server!")
        .setColor("BLUE");
    message.channel.send(embed);
}

module.exports.help = {
    name: "invite",
    aliases: [""]
}