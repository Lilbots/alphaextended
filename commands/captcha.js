const Discord = require('discord.js');
const db = require('quick.db');
const { Canvas } = require('canvas-constructor');
const capchatCore = require('../utils/capchatCore');

module.exports.run = async(client, message, args, prefix) => {
        //message.reply("Temporary disabled");
        if (args[0] === "setup") {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send('You dont have the perms to do that.');
            const questions = ['How much attempt do you want the member to have? (ex. 3)', '**@MENTION** the role that you want the user to have when the capchat is completed'];
            const embed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setTitle(`Captcha setup`)
                .setDescription(`${questions[0]}`)
                .setFooter("Add me :) https://bit.ly/2ZTIEvw");

            const question = await message.channel.send(embed); // store the question message object to a constant to be used later


            const filter = msg => msg.author.id === message.author.id; // creates the filter where it will only look for messages sent by the message author
            const collector = message.channel.createMessageCollector(filter, { time: 60 * 1000 }); // creates a message collector with a time limit of 60 seconds - upon that, it'll emit the 'end' event

            const answers = []; // basic way to store to the answers, for this example

            collector.on('collect', async msg => { // when the collector finds a new message
                if (answers[0] != null) {
                    const role = msg.mentions.roles.first();
                    if (role) {
                        answers.push(role);
                    } else {
                        embed.setDescription('Invalid role mention.');
                        question.edit(embed);
                        return collector.stop('stop');
                    }
                } else {
                    answers.push(parseInt(msg.content) || 3);
                }
                await msg.delete();
                await questions.shift();
                if (questions.length <= 0) return collector.stop('done'); // sends a string so we know the collector is done with the answers
                embed.setDescription(questions[0]);
                embed.setColor('BLUE')
                question.edit(embed).catch(error => { // catch the error if the question message was deleted - or you could create a new question message
                    console.error(error);
                    collector.stop();
                });
            });

            collector.on('end', async(collected, reason) => {
                        if (reason && reason === 'stop') { return embed.setDescription('Captcha Setup Canceled') } else {
                            await embed.setTitle(`Captcha setup info`);
                            await embed.setDescription(`**Max Attemps :** ${parseInt(answers[0])}\n**Verified role :** <@&${answers[1].id}>\n**Enabled :** ${db.get(`${message.guild.id}.capchat.enabled`) || false}\n\nTo get the captcha logs you need to create a channel with this exact name : **captcha-logs** if the name is inccorect it will not work`);
                await question.edit(embed);
                message.channel.send("Preview :");
                message.channel.send(capchatCore());
                db.set(`${message.guild.id}.capchat.maxattempts`, parseInt(answers[0]) || 3);
                db.set(`${message.guild.id}.capchat.verifiedrole`, answers[1]);
                db.set(`${message.guild.id}.capchat.setuped`, true);
            }
        })
        return;
    } else if (args[0] === "enable") {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send('You dont have the perms to do that.');
        if (db.get(`${message.guild.id}.capchat.setuped`)) {
            db.set(`${message.guild.id}.capchat.enabled`, true);
            message.reply("Succefully enabled the capchat for this server");
        } else {
            message.reply("You need to setup the capchat before enabling it (**%captcha setup** to setup)");
        }
        return;
    } else if (args[0] === "disable") {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send('You dont have the perms to do that.');
        if (db.get(`${message.guild.id}.capchat.setuped`)) {
            db.set(`${message.guild.id}.capchat.enabled`, false);
            message.reply("Succefully disabled the capchat for this server");
        } else {
            message.reply("You need to setup the capchat before disabling it (**%captcha setup** to setup)");
        }
        return;
    } else if (args[0] === "info") {
        if (db.get(`${message.guild.id}.capchat.setuped`)) {
        const embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle("Captcha infos")
        .setDescription(`**Max Attemps :** ${db.get(`${message.guild.id}.capchat.maxattempts`)}\n**Verified role :** <@&${db.get(`${message.guild.id}.capchat.verifiedrole`).id}>\n**Enabled :** ${db.get(`${message.guild.id}.capchat.enabled`) || false}`)
        .setFooter("Add me :) https://bit.ly/2ZTIEvw");
        message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setTitle("Captcha is not setup")
            .setDescription(`You need to setup the captcha with **%captcha setup** before seeing the infos`)
                    .setFooter("Add me :) https://bit.ly/2ZTIEvw");
            message.channel.send(embed);
        }
        return;
    } else {
        return message.reply("Invalid action. You need to choose an action : setup/enable/disable/info");
    }
}

module.exports.help = {
    name: "captcha",
    aliases: [""]
}