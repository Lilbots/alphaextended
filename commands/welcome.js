const Discord = require('discord.js')
const db = require('quick.db');

module.exports.run = async(client, message, args, prefix) => {
    if (!message.member.hasPermission('MANAGE_SERVER')) return message.channel.send('You dont have the perms to do that.');
    // msg = message;
    const questions = ['What will be the message that I will send to a new user?', 'What will be the title of the embed?'];
    const embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`Welcome setup`)
        .setDescription(`${questions[0]}`);

    const question = await message.channel.send(embed); // store the question message object to a constant to be used later


    const filter = msg => msg.author.id === message.author.id; // creates the filter where it will only look for messages sent by the message author
    const collector = message.channel.createMessageCollector(filter, { time: 60 * 1000 }); // creates a message collector with a time limit of 60 seconds - upon that, it'll emit the 'end' event

    const answers = []; // basic way to store to the answers, for this example

    collector.on('collect', async msg => { // when the collector finds a new message
        answers.push(msg.content);
        await msg.delete();
        await questions.shift();
        if (questions.length <= 0) return collector.stop('done'); // sends a string so we know the collector is done with the answer
        embed.setDescription(questions[0]);
        embed.setColor('RANDOM')
        question.edit(embed).catch(error => { // catch the error if the question message was deleted - or you could create a new question message
            console.error(error);
            collector.stop();
        });
    });

    collector.on('end', async(collected, reason) => {
        //var c = answers[0].match(/\d+/g);
        if (reason && reason === 'stop') { return embed.setDescription('Welcome Setup Canceled') } else {
            const mhs = MHSId();
            const mis = MisId();
            await embed.setTitle(`Welcome info`);
            await embed.setDescription(`**Message :** ${answers[0]}\n**Embed title :** ${answers[1]}\n**MHS Id :** ${mhs}\n**MIS Id :** ${mis}`);

            await question.edit(embed);
            db.set(`${message.guild.id}.wel.msg`, answers[0]);
            db.set(`${message.guild.id}.wel.tt`, answers[1]);
            db.set(`${message.guild.id}.wel.mhs`, mhs);
            db.set(`${message.guild.id}.wel.mis`, mis);
            message.channel.send('**Preview :**');

            const previw = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle(db.get(`${message.guild.id}.wel.tt`))
                .setDescription(db.get(`${message.guild.id}.wel.msg`));
            message.channel.send(previw);
        }
    })
}

function MHSId() {
    let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function MisId() {
    let s4 = () => {
            return Math.floor((1 + Math.random()) * 10000)
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return parseInt(s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4());
}

module.exports.help = {
    name: "welcomeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    aliases: ["wel"]
}