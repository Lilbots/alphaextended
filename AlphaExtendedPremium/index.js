const Discord = require('discord.js');
const client = new Discord.Client();
const { token } = require("./config.json");
const fs = require("fs");
const db = require('quick.db');
const webhook = require("webhook-discord");
const moment = require("moment");
const winston = require('winston');
const logWebhook = "https://discordapp.com/api/webhooks/716075712238321735/F-GSdyNXIQ0rdtACIf8xnlj09geES0QXMge5mpD0KoL0AjoE3ED1AdvkDqo6ryq_OrPg";
const notifWebhook = "https://discordapp.com/api/webhooks/717106000288677899/hBWUtxIG4MJCjb6AQMwfuuNazHUT6sFwOJNtoLOMZqx3wicfngBCUzCEU_uu3K3YAecC";
const { Canvas } = require('canvas-constructor');
const { MessageAttachment } = require('discord.js');
const capchatText = require('./utils/capchatText')
const encryptor = require('./utils/encryptor')
let prefix = "&";
const line = require('line-reader');
const _ = require('lodash');
let queue = new Map();
const path = require('path');

//require('./express/server.js')(client);
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.align(),
        winston.format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
        winston.format.printf(log => `[${log.timestamp}] [${log.level}]: ${log.message}`)
    )
})

//require('./server')(client);
var AsciiTable = require("ascii-table");
var table = new AsciiTable('Commands')
table
    .setHeading('Name', 'State');

fs.readdir(path.join(__dirname, "commands/"), (err, files) => {
    if (err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }


    jsfile.forEach((f, i) => {
        let props = require(path.join(__dirname, `commands/${f}`));
        console.log(`${f} loaded!`);
        client.commands.set(props.help.name, props);
        props.help.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);

        });
        table.addRow(f, "[LOADED]");
    });
})

client.on('ready', () => {
    //  db.set('servercount', client.guilds.cache.size);
    //  db.set('channelscount', client.channels.cache.size);
    //   db.set('usercount', client.users.cache.size);
    console.log("Im online");
    const activities_list = [
        `&help`,
        //`Cat cant fly`,
        //`${db.get('servercount') || 2} servers`
    ]

    client.user.setStatus('online')
    let index = 0;
    client.user.setActivity(`${prefix}help`, { type: "STREAMING", url: "https://www.twitch.tv/alphaextendedbot" });
    const Hook = new webhook.Webhook(logWebhook);
    const msg = new webhook.MessageBuilder()
        .setName('Alpha Extended')
        .setText(`\`\`\`css\n${table.toString()}\`\`\``);
    // Hook.send(msg).catch(err2 => client.logger.error(err2));
})

client.on('message', async message => {
    //db.set(`${message.guild.id}.license.activated`, false);
    //db.set(`${message.guild.id}.license.type`, "");
    if (message.author.bot) return;
    if (!db.get(`${message.guild.id}.prefix`)) {
        prefix = "&";
    } else {
        prefix = db.get(`${message.guild.id}.prefix`);
    }
    client.user.setActivity(`${prefix}help`, { type: "STREAMING", url: "https://www.twitch.tv/alphaextendedbot" });
    if (db.get(`${message.guild.id}.license.activated`) === null) db.set(`${message.guild.id}.license.activated`, false);
    if (!db.get(`${message.guild.id}.license.activated`)) {
        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let cmd = args.shift().toLowerCase();
        if (cmd === "activate") {
            if (message.content.startsWith(prefix)) {
                if (args[0] === "premium") {
                    var d = [];
                    db.get('licenses.keys.premium').forEach(id => {
                        d.push(id);
                    })

                    if (d.includes(args[1])) {
                        const embed = new Discord.MessageEmbed()
                            .setColor("ORANGE")
                            .setTitle("License activated!")
                            .setDescription(`Thanks for buying and using **Alpha Extended Premium**! You can now use all the perks of Premium!`);
                        db.set(`${message.guild.id}.license.activated`, true);
                        db.set(`${message.guild.id}.license.type`, "Premium");
                        removeLicensePremium(args[1]);
                        console.log(db.get("licenses.keys.premium"))
                        message.delete();
                        return message.channel.send(embed);
                    } else {
                        const embed = new Discord.MessageEmbed()
                            .setColor("ORANGE")
                            .setTitle("Invalid license key")
                            .setDescription(`The license you provided is not valid. Please provide a correct one.\n\nIf you already bought a license key and it not working please dm Lil biscotine#7291`);
                        return message.channel.send(embed);
                    }
                } else if (args[0] === "platinium") {
                    var d = [];
                    db.get('licenses.keys.platinium').forEach(id => {
                        d.push(id);
                    })

                    if (d.includes(args[1])) {
                        const embed = new Discord.MessageEmbed()
                            .setColor("ORANGE")
                            .setTitle("License activated!")
                            .setDescription(`Thanks for buying and using **Alpha Extended Premium**! You can now use all the perks of Platinium!`);
                        db.set(`${message.guild.id}.license.activated`, true);
                        db.set(`${message.guild.id}.license.type`, "Platinium");
                        removeLicensePlatinium(args[1]);
                        console.log(db.get("licenses.keys.platinium"))
                        message.delete();
                        return message.channel.send(embed);
                    } else {
                        const embed = new Discord.MessageEmbed()
                            .setColor("ORANGE")
                            .setTitle("Invalid license key")
                            .setDescription(`The license you provided is not valid. Please provide a correct one.\n\nIf you already bought a license key and it not working please dm Lil biscotine#7291`);
                        return message.channel.send(embed);
                    }
                } else {
                    return message.reply("Invalid license type you provided. `&activate premium/platinium licenseKey`");
                }
            }
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor("ORANGE")
                .setTitle("License not activated")
                .setDescription(`If you want to use this bot in your server you need to purchase a license key.\n\nYou can do \`${prefix}activate premium/platinium licenseKey\` to active the bot.`);
            message.channel.send(embed);
        }
    } else {
        msg = message
        if (message.author.bot) return;
        let messageArray = message.content.split(" ");
        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let cmd = args.shift().toLowerCase();
        if (!message.content.startsWith(prefix)) return;
        let commandfile;
        if (client.commands.has(cmd)) {
            commandfile = client.commands.get(cmd);
        } else if (client.aliases.has(cmd)) {
            commandfile = client.commands.get(client.aliases.get(cmd));
        }

        if (!message.content.startsWith(prefix)) return;


        try {
            commandfile.run(client, message, args, prefix, queue);

        } catch (e) {}
    }
});

client.on('guildMemberAdd', async member => {
            // db.set('servercount', client.guilds.cache.size);
            //   db.set('channelscount', client.channels.cache.size);
            // db.set('usercount', client.users.cache.size);
            if (db.get(`${member.guild.id}.capchat.setuped`) && db.get(`${member.guild.id}.capchat.enabled`)) {
                const text = capchatText();
                Canvas.registerFont(__dirname + '/captcha code.otf', {
                    family: "Capchat"
                })
                const buffer = new Canvas(200, 120)
                    .setColor('#ffffff')
                    .addRect(0, 0, 200, 120)
                    .save()
                    .setColor("#23272A")
                    .restore()
                    .setColor('#000000')
                    .setTextAlign('start')
                    .setTextFont('35px Capchat')
                    .addText(text, 40, 65)
                    .toBuffer();
                const filename = `capchat.png`;
                const attachment = new MessageAttachment(buffer, filename);
                const logChannel = member.guild.channels.cache.find(r => r.name === "captcha-logs");
                const id = ID();
                db.set(`${member.guild.id}.${member.id}.capchat.attemptsleft`, db.get(`${member.guild.id}.capchat.maxattempts`));
                //member.send('Complete the capchat below to enter in ' + member.guild.name + ". You have 2 minutes to respond")
                const embed = new Discord.MessageEmbed()
                    .setColor("BLUE")
                    .setTitle("Hello there! Welcome to " + member.guild.name + "!")
                    .setDescription("To enter the server you need to complete this simple captcha\n\nWhy?\nYou need to complete this captcha because the captcha protect servers from self-bot\n\nAlso you have 2 minutes to complete it\n\nHere is you captcha :")
                    .setFooter("Add me :) https://bit.ly/2ZTIEvw");
                const msg = await member.send(embed, attachment);
               // await member.send(attachment);
                if (logChannel) {
                    const embed = new Discord.MessageEmbed()
                        .setColor('BLUE')
                        .setTitle("Captcha Created")
                        .addField("User", member.user.tag, true)
                        .addField("Code", text, true)
                        .addField("Captcha Id", id)
                        .setFooter("Add me :) https://bit.ly/2ZTIEvw");
                    logChannel.send(embed);
                }
                //captchatLog("Captcha created", `**Code :** ${text}\n**Id :** ${id()}\n**Server :** ${member.guild.name} (${member.guild.id})`);
                try {
                    const filter = m => {
                            if (m.author.bot) return;
                            if (db.get(`${member.guild.id}.${member.id}.capchat.attemptsleft`) === 0) {
                                if (db.get(`${member.guild.id}.${member.id}.capchat.last`) === text) {} else {
                                    const embed = new Discord.MessageEmbed()
                                        .setColor("RED")
                                        .setTitle("You dont have attemps left")
                                        .setDescription("You will be auto-kick from the server to protect it because you dont have any attemps left")
                                        .setFooter("Add me :) https://bit.ly/2ZTIEvw");
                                    member.send(embed);
                                    if (logChannel) {
                                        const embed = new Discord.MessageEmbed()
                                            .setColor('RED')
                                            .setTitle(`Captcha Failed (No attemps left)`)
                                            .addField("User", member.user.tag, true)
                                            .addField("Code", text, true)
                                            .addField("Captcha Id", id)
                                            .setFooter("Add me :) https://bit.ly/2ZTIEvw");
                                        logChannel.send(embed);
                                    }
                                    db.set(`${member.guild.id}.${member.id}.capchat.last`, text);
                                    member.kick();
                                    return;
                                }
                            }
                            if (m.author.id === member.id && m.content === text) return true;
                            else {
                                if (db.get(`${member.guild.id}.${member.id}.capchat.last`) === text) {} else {
                                    db.set(`${member.guild.id}.${member.id}.capchat.attemptsleft`, db.get(`${member.guild.id}.${member.id}.capchat.attemptsleft`) - 1);
                                    const embed = new Discord.MessageEmbed()
                                        .setColor("RED")
                                        .setTitle("Incorrect captcha retry")
                                        .setDescription("You have " + db.get(`${member.guild.id}.${member.id}.capchat.attemptsleft`) + " attemps left")
                                        .setFooter("Add me :) https://bit.ly/2ZTIEvw");
                                    m.channel.send(embed);
                                    if (logChannel) {
                                        const embed = new Discord.MessageEmbed()
                                            .setColor('RED')
                                            .setTitle(`Captcha Failed ${db.get(`${member.guild.id}.${member.id}.capchat.attemptsleft`)}/${db.get(`${member.guild.id}.capchat.maxattempts`)}`)
                                        .addField("User", member.user.tag, true)
                                        .addField("Code", text, true)
                                        .addField("User answer", m.content, true)
                                        .addField("Captcha Id", id)
                                        .setFooter("Add me :) https://bit.ly/2ZTIEvw");
                                    logChannel.send(embed);
                                }
                            return false;
                            }
                    }
            };
            const response = await msg.channel.awaitMessages(filter, { max: 1, time: 120000, errors: ['time'] });
            if (response) {
                const embed = new Discord.MessageEmbed()
                .setColor("BLUE")
                .setTitle("You've been verified!")
                .setDescription("You can now go in " + member.guild.name + " enjoy!")
                .setFooter("Add me :) https://bit.ly/2ZTIEvw");
                await msg.channel.send(embed);
                await member.roles.add(db.get(`${member.guild.id}.capchat.verifiedrole`).id);
                if (logChannel) {
                    const embed = new Discord.MessageEmbed()
                        .setColor('BLUE')
                        .setTitle("Captcha Completed")
                        .addField("User", member.user.tag, true)
                        .addField("Code", text, true)
                       // .addField("User answer", response.values[response.values.length - 1].toString(), true)
                        .addField("Captcha Id", id)
                        .setFooter("Add me :) https://bit.ly/2ZTIEvw");
                    logChannel.send(embed);
                }
                db.set(`${member.guild.id}.${member.id}.capchat.last`, text);
                return;
            }
        } catch (err) {
            console.log(err);
            const embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("Captcha expired")
            .setDescription("You will be auto-kick from the server to protect it because you didnt anwser the captcha in time")
            .setFooter("Add me :) https://bit.ly/2ZTIEvw");
            await member.send(embed);
            if (logChannel) {
                const embed = new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle("Captcha Expired")
                    .addField("User", member.user.tag, true)
                    .addField("Code", text, true)
                    .addField("Captcha Id", id)
                    .setFooter("Add me :) https://bit.ly/2ZTIEvw");
                logChannel.send(embed);
            }
            db.set(`${member.guild.id}.${member.id}.capchat.last`, text);
            await member.kick();
            return;
        }
    }
})

client.on('guildCreate', (guild) => {
    db.set('servercount', (db.get('servercount') || 2) + 1);
    guild.owner.send('Thanks for adding me!\nMy prefix is : **&** and you can do &help for a list of commands but before you need to activate a license with `&activate LicenseKey`');
    const Hook = new webhook.Webhook(notifWebhook);
    const msg = new webhook.MessageBuilder()
        .setName('Alpha Extended')
        .setText(`**${guild.name}** added **Alpha Exetended Premium** to their server!`);
    Hook.send(msg).catch(err2 => client.logger.error(err2));
    //db.set('servercount', client.guilds.cache.size);
    // db.set('channelscount', client.channels.cache.size);
    //db.set('usercount', client.users.cache.size);
})

client.on('guildDelete', (guild) => {
    // db.set('servercount', client.guilds.cache.size);
    // db.set('channelscount', client.channels.cache.size);
    // db.set('usercount', client.users.cache.size);
})


client.on('disconnect', event => {
    client.logger.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
    const momentm = moment.duration(Date.now()).format("M/DD/YYYY HH:mm:ss");
    //   const Hook = new webhook.Webhook(logWebhook);
    const msg = new webhook.MessageBuilder()
        .setName('Alpha Extended')
        .setText(`\`\`\`css\n[${momentm}] [DISCONNECT] Disconnected with code ${event.code}.\`\`\``);
    //  Hook.send(msg).catch(err2 => client.logger.error(err2));
    require('child_process').exec("node index.js", async function() {
        // await require('child_process').exec("git pull")
        await client.destroy();
        await process.exit();
    });
});

client.on('error', err => {
    client.logger.error(err)
        //   const Hook = new webhook.Webhook(logWebhook);
    const momentm = moment.duration(Date.now()).format("M/DD/YYYY HH:mm:ss");
    const msg = new webhook.MessageBuilder()
        .setName('Alpha Extended')
        .setText(`\`\`\`css\n[${momentm}] [error]: ${err}\`\`\``);
    //  Hook.send(msg).catch(err2 => client.logger.error(err2));
});

client.on('warn', warn => {
    client.logger.warn(warn)
        //  const Hook = new webhook.Webhook(logWebhook);
    const momentm = moment.duration(Date.now()).format("M/DD/YYYY HH:mm:ss");
    const msg = new webhook.MessageBuilder()
        .setName('Alpha Extended')
        .setText(`\`\`\`css\n[${momentm}] [warn]: ${warn}\`\`\``);
    //   Hook.send(msg).catch(err2 => client.logger.error(err2));
});

client.on('debug', debug => {
    client.logger.info(debug)
        // const Hook = new webhook.Webhook(logWebhook);
    const momentm = moment.utc(Date.now()).format("M/DD/YYYY HH:mm:ss");
    const msg = new webhook.MessageBuilder()
        .setName('Alpha Extended')
        .setText(`\`\`\`css\n[${momentm}] [info]: ${debug}]\n\`\`\``);

    // Hook.send(msg).catch(err2 => client.logger.error(err2));
})

client.on('commandError', (command, err) => {
    client.logger.error(`[COMMAND:${command.name}]\n${err.stack}`)
        //const Hook = new webhook.Webhook(logWebhook);
    const momentm = moment.duration(Date.now()).format("M/DD/YYYY HH:mm:ss");

    const msg = new webhook.MessageBuilder()
        .setName('Alpha Extended')
        .setText(`\`\`\`css\n[${momentm}] [error]: [COMMAND:${command.name}]\n${err.stack}\`\`\``);
    //  Hook.send(msg).catch(err2 => client.logger.error(err2));
});

function captchatLog(title, des) {
    //  const Hook = new webhook.Webhook("https://discordapp.com/api/webhooks/716383202851422208/L6AZUhAe-JLzVzf2azWsrkX-dmtLvUdOrSdUcnIKGd5j2cDsY0F7cxWrzfklyU4n4_AX");
    const msg = new webhook.MessageBuilder()
        .setName('Alpha Extended')
        .setTitle(title)
        .setDescription(des);
    Hook.send(msg).catch(err2 => client.logger.error(err2));
}

function ID() {
    let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function removeLicensePremium(id) {
    let f = db.get("licenses.keys.premium");
    var s = [];
    f.forEach(f => {
        s.push(f);
    })
    console.log(s)
    s = _.reject(s, function(el) { return el === id; })
    db.set("licenses.keys.premium", s);
}

function removeLicensePlatinium(id) {
    let f = db.get("licenses.keys.platinium");
    var s = [];
    f.forEach(f => {
        s.push(f);
    })
    console.log(s)
    s = _.reject(s, function(el) { return el === id; })
    db.set("licenses.keys.platinium", s);
}


client.login(token);
client.login(token);
