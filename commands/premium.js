const Discord = require('discord.js')

module.exports.run = async(client, message, args, prefix) => {
    let embed = new Discord.MessageEmbed()
        .setTitle(`Premium`)
        .addField("With Premium you get", "**Music Commands**\n**Up to 65 backups**\n**Custom Prefix**\n**Interval server backups**\n**Better security**")
        .addField("With Platinium you get", "**Music Commands**\n**Up to 125 backups**\n**Custom Prefix**\n**Interval server backups**\n**Better security**\n**Customizable captcha**\n**Advanced backups and captcha**\n**And much more!**")
        .setColor("ORANGE");
    message.channel.send(embed);
}

module.exports.help = {
    name: "premium",
    aliases: [""]
}