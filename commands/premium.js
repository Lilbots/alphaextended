const Discord = require('discord.js')

module.exports.run = async(client, message, args, prefix) => {
    let embed = new Discord.MessageEmbed()
        .setTitle(`Premium`)
        .addField("With Premium you get", "**Music Commands**\n**A custom role and you get mention in our server**\n**Custom Prefix**\n**Better server backup**\n**Better security**\n**And much more!**")
        .setColor("ORANGE");
    message.channel.send(embed);
}

module.exports.help = {
    name: "premium",
    aliases: [""]
}