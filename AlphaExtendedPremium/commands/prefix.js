const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async(client, message, args, prefix) => {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You dont have the perm to do that. You need to have permission to **Manage server**");
        if (!args[0]) return message.reply("You need to provide a prefix");
        db.set(`${message.guild.id}.prefix`, args[0]);
        message.reply(`Succefully changed the prefix to ${ db.get(`${message.guild.id}.prefix`)}`);
        client.user.setActivity(`${db.get(`${message.guild.id}.prefix`)}help`, { type: "STREAMING", url: "https://www.twitch.tv/alphaextendedbot" });
        //message.guild.members.cache.get(c => c.id = client.user.id).setNickname(`[${db.get(`${message.guild.id}.prefix`)}] Alpha Extended Premium`)
}

module.exports.help = {
    name: "prefix",
    aliases: [""]
}