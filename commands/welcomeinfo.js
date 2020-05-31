const Discord = require('discord.js')
const db = require('quick.db');

module.exports.run = async(client, message, args, prefix) => {
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`Welcome info`)
            .setDescription(`**Message :** ${db.get(`${message.guild.id}.wel.msg`)}\n**Embed title :** ${db.get(`${message.guild.id}.wel.tt`)}\n**MHS Id :** ${db.get(`${message.guild.id}.wel.mhs`)}\n**MIS Id :** ${db.get(`${message.guild.id}.wel.mis`)}`);
            message.channel.send(embed);
}


module.exports.help = {
    name: "welcomeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    aliases: ["welinfo"]
}