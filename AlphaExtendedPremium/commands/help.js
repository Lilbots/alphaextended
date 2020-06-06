const Discord = require('discord.js')
const db = require('quick.db');

module.exports.run = async(client, message, args, prefix) => {
        if (db.get(`${message.guild.id}.license.type`) === "Platinium") {
            message.react("✅");
            let embed = new Discord.MessageEmbed()
                .setTitle(`Prefix : ${prefix} || License type : **${db.get(`${message.guild.id}.license.type`)}**`)
            .addField(`${prefix}`, "**help :** Get a list of command\n**report :** Report a bug to the developers\n**invite :** Get an invite to add this bot to your server\n**prefix :** Change the bot prefix")
            .addField("captcha (setup/enable/disable/info/interval)", "**setup :** Setup the captcha in your server\n**enable :** Enable the captcha\n**disable :** Disable the captcha\n**info :** See info about captcha in your server\n**interval (interval):** Set the backup interval")
            .addField("backup (create/load/remove/list)", "**create :** Create a backup of your server\n**load (backupId) :** Load a backup of your server by id\n**remove (backupId) :** Remove backup by id\n**list :** See the list of all your backups")
            .addField("music (play/stop/skip/queue/connect/disconnect)", "**play (musicName):** Play a song of your choice\n**stop/skip :** Stop and skip the current song playing\n**queue :** See the song queue\n**connect/disconnect :** Connect/Disconnect the bot from a voice channel")
           // .addField("anti (spam/)", "**spam (setup/info/enable/disable):** Setup/Disable/Enable the anti-spam or see the anti-spam infos\n")
            .addField("customize (captcha)", "**captcha :** Customize the captcha style\n")
            .addField("BETA (nameOfTheFeature)", "**nameOfTheFeature :** Test the feature that you provideed\n")
            .addField("BETA Features", "**music lyrics :** Get the lyrics of the current playing song")
            .addField("You can join our support server", "[Alpha Extended Support Server](https://discord.gg/rCyvbWZ)")
            .addField("You can support us with", "[Patreon](https://paypal.me/chilledvibes)\n[Paypal](https://patreon.com/chilledVibes)")
            .setColor("ORANGE");
        message.channel.send(embed);
        } else if (db.get(`${message.guild.id}.license.type`) === "Premium") {
            message.react("✅");
            let embed = new Discord.MessageEmbed()
                .setTitle(`Prefix : ${prefix} || License type : **${db.get(`${message.guild.id}.license.type`)}**`)
                .addField(`${prefix}`, "**help :** Get a list of command\n**report :** Report a bug to the developers\n**invite :** Get an invite to add this bot to your server\n**prefix :** Change the bot prefix")
                .addField("captcha (setup/enable/disable/info/interval)", "**setup :** Setup the captcha in your server\n**enable :** Enable the captcha\n**disable :** Disable the captcha\n**info :** See info about captcha in your server\n**interval (interval):** Set the backup interval")
                .addField("backup (create/load/remove/list)", "**create :** Create a backup of your server\n**load (backupId) :** Load a backup of your server by id\n**remove (backupId) :** Remove backup by id\n**list :** See the list of all your backups")
                .addField("music (play/stop/skip/queue/connect/disconnect)", "**play (musicName):** Play a song of your choice\n**stop/skip :** Stop and skip the current song playing\n**queue :** See the song queue\n**connect/disconnect :** Connect/Disconnect the bot from a voice channel")
                .addField("You can join our support server", "[Alpha Extended Support Server](https://discord.gg/rCyvbWZ)")
                .addField("You can support us with", "[Patreon](https://paypal.me/chilledvibes)\n[Paypal](https://patreon.com/chilledVibes)")
                .setColor("ORANGE");
        message.channel.send(embed);
        } else {
        message.react("✅");
        let embed = new Discord.MessageEmbed()
            .setTitle(`Prefix : ${prefix} || License type : **${db.get(`${message.guild.id}.license.type`)}**`)
        .addField("misc", "**help :** Get a list of command\n**report :** Report a bug to the developers\n**invite :** Get an invite to add this bot to your server\n**premium :** See what premium has to offer")
        .addField("captcha (setup/enable/disable/info)", "**setup :** Setup the captcha in your server\n**enable :** Enable the captcha\n**disable :** Disable the captcha\n**info :** See info about captcha in your server")
        .addField("backup (create/load/remove/list)", "**create :** Create a backup of your server\n**load (backupId) :** Load a backup of your server by id\n**remove (backupId) :** Remove backup by id\n**list :** See the list of all your backups")
        .addField("You can join our support server", "[Alpha Extended Support Server](https://discord.gg/rCyvbWZ)")
        .addField("You can support us with", "[Patreon](https://paypal.me/chilledvibes)\n[Paypal](https://patreon.com/chilledVibes)")
        .setColor("ORANGE");
    message.channel.send(embed);
        }
}

module.exports.help = {
    name: "help",
    aliases: [""]
}