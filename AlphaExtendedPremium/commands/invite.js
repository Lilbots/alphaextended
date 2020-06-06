const Discord = require('discord.js')

module.exports.run = async(client, message, args, prefix) => {
    let embed = new Discord.MessageEmbed()
        .setTitle(`Invite`)
        .setDescription("Click [invite](https://discord.com/oauth2/authorize?client_id=717096158169923676&scope=bot&permissions=2146958847) to add me to your server! (You also need to buy a license)")
        .setColor("ORANGE");
    message.channel.send(embed);
}

module.exports.help = {
    name: "invite",
    aliases: [""]
}