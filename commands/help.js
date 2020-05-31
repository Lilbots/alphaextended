const Discord = require('discord.js')

module.exports.run = async(client, message, args, prefix) => {
    message.react("✅");
    let embed = new Discord.MessageEmbed()
        .setTitle(`Prefix : ${prefix}`)
        .setDescription("```css\n[help]\nGet help if you dont know something\n\n[captcha (setup/enable/disable/info)]\nSetup/enable/disable or see info about the capchat in your server\n\n[backup create/list)]\nCreate backup of your server. You can also check all the backups that you made of your server with %backup list\n\n[backup (remove/load) backupId]\nLoad or remove a backup of your server\n\n[report reason]\nReport a bug to my developers```")
        .setFooter("You can donate at (https://paypal.me/chilledvibes) or (https://patreon.com/chilledVibes)")
        .setColor("RANDOM");
    message.author.send(embed);
}

module.exports.help = {
    name: "help",
    aliases: [""]
}