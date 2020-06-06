const Discord = require('discord.js')

module.exports.run = async(client, message, args, prefix) => {
    message.react("✅");
    let embed = new Discord.MessageEmbed()
        .setTitle(`Prefix : ${prefix}`)
        .addField(`${prefix}`, "**help :** Get a list of command\n**report :** Report a bug to the developers\n**invite :** Get an invite to add this bot to your server\n**premium :** See what premium has to offer")
        .addField("captcha (setup/enable/disable/info)", "**setup :** Setup the captcha in your server\n**enable :** Enable the captcha\n**disable :** Disable the captcha\n**info :** See info about captcha in your server")
        .addField("backup (create/load/remove/list)", "**create :** Create a backup of your server\n**load (backupId) :** Load a backup of your server by id\n**remove (backupId) :** Remove backup by id\n**list :** See the list of all your backups")
        .addField("You can join our support server", "[Alpha Extended Support Server](https://discord.gg/rCyvbWZ)")
        .addField("You can support us with", "[Patreon](https://paypal.me/chilledvibes)\n[Paypal](https://patreon.com/chilledVibes)")
        .setColor("BLUE");
    message.channel.send(embed);
}

module.exports.help = {
    name: "help",
    aliases: [""]
}