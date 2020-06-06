const Discord = require('discord.js');
const backup = require("discord-backup");
const moment = require("moment");
const fs = require('fs')

module.exports.run = async(client, message, args, prefix) => {
    if (args[0] === "create") {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You dont have the perms to do that");
        if ((await backup.list()).length === 125) return message.reply("You have reach the max backups count. To make more backup you need to purchase premium");
        const loading = new Discord.MessageEmbed()
            .setColor("ORANGE")
            .setTitle("Creating backup please wait...");
        const msg = await message.channel.send(loading);
        backup.create(message.guild).then((backupData) => {
            console.log(backupData.id); // NSJH2
            backup.fetch(backupData.id).then((backupInfos) => {
                console.log(backupInfos);
                /*
                {
                    id: "BC5qo",
                    size: 0.05
                    data: {BackupData}
                }
                */
                const momentm = moment.utc(backupInfos.data.createdTimestamp).format("M/DD/YYYY HH:mm:ss");
                loading.setTitle("Backup created");
                loading.setTitle("Backup created");
                loading.addField("Server name", message.guild.name, true);
                loading.addField("Server id", message.guild.id, true)
                loading.addField("Backup id", backupData.id, true);
                loading.addField("Created on (UTC)", momentm, true);
                loading.addField("Backup size", backupInfos.size, true)
                    //loading.addField("Backup data", backupInfos.data, true);
                msg.edit(loading);
            });
        });
    } else if (args[0] === "load") {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You dont have the perms to do that");
        if (!parseInt(args[1])) return message.reply("You need to provide a valid backup id to load a backup (e.g. %backup load 345534643562)");
        const id = args[1];
        backup.fetch(id).then(async() => {
            // If the backup exists, request for confirmation
            message.channel.send(":warning: When the backup is loaded, all the channels, roles, etc. will be replaced Type `-confirm` to confirm");
            await message.channel.awaitMessages(m => (m.author.id === message.author.id) && (m.content === "-confirm"), {
                max: 1,
                time: 20000,
                errors: ["time"]
            }).catch((err) => {
                // if the author of the commands does not confirm the backup loading
                return message.channel.send(":x: Backup loading cancelled");
            });
            // When the author of the command has confirmed that he wants to load the backup on his server
            message.author.send(":white_check_mark: Backup loading started");
            // Load the backup
            backup.load(id, message.guild).then(() => {
                // When the backup is loaded, delete them from the server
                backup.remove(id);
            }).catch((err) => {
                // If an error occurred
                return message.author.send(":x: An error occurred... To get support you can dm Lil biscotine#7291 or you can use the command %report to report a bug");
            });
        }).catch((err) => {
            console.log(err);
            // if the backup wasn't found
            return message.channel.send(":x: No backup found for `" + id + "`");
        });
    } else if (args[0] === "remove") {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You dont have the perms to do that");
        if (!parseInt(args[1])) return message.reply("You need to provide a backup id to remove a backup (e.g. %backup remove 345534643562)");
        backup.remove(args[1]).then(() => {
            return message.reply(`Succefully removed the backup (Backup id : ${args[1]}`);
        }).catch((err) => {
            console.log(err);
            return message.channel.send(":x: No backup found for `" + id + "`");
        })
    } else if (args[0] === "list") {
        let embed = new Discord.MessageEmbed()
            .setColor("ORANGE")
            .setTitle("All backups (Fetching...)");
        const msg = await message.channel.send(embed);
        await backup.list().then((backups) => {
            console.log(backups); // Expected Output [ "BC5qo", "Jdo91", ...]
            backups.forEach(bkp => {
                    backup.fetch(bkp).then((backupInfos) => {
                        // console.log(backupInfos);
                        let dataa = "";
                        const momentm = moment.utc(backupInfos.data.createdTimestamp).format("M/DD/YYYY HH:mm:ss");
                        const data = JSON.parse(JSON.stringify(backupInfos.data));
                        const name = data['name'];
                        const name2 = '**' + data['name'] + '**';
                        const region = '**' + data['region'] + '**';
                        const verificationlevel = '**' + data['verificationLevel'] + '**';
                        const explicitContentFilter = '**' + data['explicitContentFilter'] + '**';
                        const defaultmessagenotifications = '**' + data['defaultMessageNotifications'] + '**';
                        const guildid = '**' + data['guildID'] + '**';
                        const iconurl = '**' + data['iconURL'] + '**';

                        const name3 = data['name'];
                        const region3 = data['region'];
                        const verificationlevel3 = data['verificationLevel'];
                        const explicitContentFilter3 = data['explicitContentFilter'];
                        const defaultmessagenotifications3 = data['defaultMessageNotifications'];
                        const guildid3 = data['guildID'];
                        const iconurl3 = data['iconURL'];

                        console.log(name);
                        if (name === message.guild.name) {
                            dataa = `Id : ${backupInfos.id}\nCreated on : ${momentm}\nBackup size : ${backupInfos.size}\nName : ${name3}\nRegion : ${region3}\nVerification level : ${verificationlevel3}\nExplicit Content Filter : ${explicitContentFilter3}\nDefault Message Notification : ${defaultmessagenotifications3}\nServer id : ${guildid3}\nIcon Url : ${iconurl3}\n\n\n`;
                            embed.addField(`Id : ${backupInfos.id}\nCreated on : ${momentm}\n`, `Backup size : ${backupInfos.size}\nName : ${name2}\nRegion : ${region}\nVerification level : ${verificationlevel}\nExplicit Content Filter : ${explicitContentFilter}\nDefault Message Notification : ${defaultmessagenotifications}\nServer id : ${guildid}\nIcon Url : ${iconurl}\n\n\n`)
                            msg.edit(embed);
                            fs.appendFile(`backup-list-${message.guild.name}.txt`, dataa, function(err) {
                                if (err) return console.log(err);
                            });
                        }
                    });
                })
                //embed.setTitle("All backups");
                // await msg.edit(embed);
                // await message.channel.send(({ files: [{ attachment: `backup-list-${message.guild.name}.txt` }] })).catch()
                /* fs.unlink(`backup-list-${message.guild.name}.txt`, function(err) {
                     if (err) throw err;
                     console.log('File deleted!');
                 });*/
                /*fs.unlink(`backup-list-${message.guild.name}.txt`, function(err) {
                    if (err) throw err;
                    console.log('File deleted!');
                });*/

        });
        await embed.setTitle(`All backups (${(await backup.list()).length} backups)`);
        await msg.edit(embed);
        await message.channel.send(({ files: [{ attachment: `backup-list-${message.guild.name}.txt` }] })).catch()
        fs.unlink(`backup-list-${message.guild.name}.txt`, function(err) {
            if (err) throw err;
            console.log('File deleted!');
        });
    } else {
        return message.reply("Invalid action. You need to choose an action : create/load/remove/list");
    }
}

module.exports.help = {
    name: "backup",
    aliases: [""]
}
