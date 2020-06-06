const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const ytdl = require("ytdl-core");
const Youtube = require('simple-youtube-api');
const youtube = new Youtube('AIzaSyB4-G84e7LJmSR5XQZ5s5UOLI3QPfTQ8ok');


module.exports.run = async(client, message, args, prefix, queue) => {
    if (args[0] === "play") {
        message = msg;
        try {
            const videos = await youtube.searchVideos(args, 5);
            /*if (videos.length < 5) {
                return message.channel.send(
                    `I had some trouble finding what you were looking for, please try again or be more specific`
                );
            }*/
            const vidNameArr = [];
            for (let i = 0; i < videos.length; i++) {
                vidNameArr.push(`${i + 1}: ${videos[i].title}`);
            }
            vidNameArr.push('exit');
            const embed = new MessageEmbed()
                .setColor('ORANGE')
                .setTitle('Choose a song by commenting a number between 1 and 5')
                .addField('Song 1', vidNameArr[0])
                .addField('Song 2', vidNameArr[1])
                .addField('Song 3', vidNameArr[2])
                .addField('Song 4', vidNameArr[3])
                .addField('Song 5', vidNameArr[4])
                .addField('Exit', 'exit');
            var songEmbed = await message.channel.send({ embed });
            try {
                var response = await message.channel.awaitMessages(
                    msg => (msg.content > 0 && msg.content < 6) || msg.content === 'exit', {
                        max: 1,
                        maxProcessed: 1,
                        time: 60000,
                        errors: ['time']
                    }
                );
                var videoIndex = parseInt(response.first().content);
            } catch (err) {
                // console.error(err);
                if (songEmbed) {
                    songEmbed.delete();
                }
                return message.channel.send(
                    'Please try again and enter a number between 1 and 5 or exit'
                );
            }
            if (response.first().content === 'exit') return songEmbed.delete();
            try {
                var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                // // can be uncommented if you don't want the bot to play live streams
                // if (video.raw.snippet.liveBroadcastContent === 'live') {
                //   songEmbed.delete();
                //   return message.say("I don't support live streams!");
                // }

                // // can be uncommented if you don't want the bot to play videos longer than 1 hour
                // if (video.duration.hours !== 0) {
                //   songEmbed.delete();
                //   return message.say('I cannot play videos longer than 1 hour');
                // }
            } catch (err) {
                // console.error(err);
                if (songEmbed) {
                    songEmbed.delete();
                }
                return message.say(
                    'An error has occured when trying to get the video ID from youtube'
                );
            }
            const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
            try {
                const args = message.content.split(" ");
                //const queue = message.client.queue;
                const serverQueue = queue.get(message.guild.id);

                const voiceChannel = message.member.voice.channel;
                if (!voiceChannel)
                    return message.channel.send(
                        "You need to be in a voice channel to play music!"
                    );
                const permissions = voiceChannel.permissionsFor(message.client.user);
                if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                    return message.channel.send(
                        "I need the permissions to join and speak in your voice channel!"
                    );
                }

                const songInfo = await ytdl.getInfo(url);
                const song = {
                    title: songInfo.title,
                    url: songInfo.video_url
                };

                if (!serverQueue) {
                    const queueContruct = {
                        textChannel: message.channel,
                        voiceChannel: voiceChannel,
                        connection: null,
                        songs: [],
                        volume: 5,
                        playing: true
                    };

                    queue.set(message.guild.id, queueContruct);

                    queueContruct.songs.push(song);

                    try {
                        var connection = await voiceChannel.join();
                        queueContruct.connection = connection;
                        play(message, queueContruct.songs[0], queue);
                    } catch (err) {
                        console.log(err);
                        queue.delete(message.guild.id);
                        return message.channel.send(err);
                    }
                } else {
                    serverQueue.songs.push(song);
                    return message.channel.send(
                        `${song.title} has been added to the queue!`
                    );
                }
            } catch (error) {
                console.log(error);
                message.channel.send(error.message);
            }
        } catch (err) {
            console.error(err);
            if (songEmbed) {
                songEmbed.delete();
            }
            return message.channel.send(
                'Something went wrong with searching the video you requested :('
            );
        }

    } else if (args[0] === "stop") {
        message = msg;

        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    } else if (args[0] === "skip") {
        message = msg;

        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
        if (!serverQueue) return message.channel.send('There is no song that I could skip!');
        serverQueue.connection.dispatcher.end();
    } else if (args[0] === "queue") {
        message = msg;
        let qs = '';
        var n = 0;
        const serverQueue = queue.get(message.guild.id);
        serverQueue.songs.forEach(element => {
            n++;
            if (n === 1) {
                qs += `**Playing - ** ${element.title}\n`;
            } else {
                qs += `**${n - 1} - ** ${element.title}\n`;
            }
        });
        const embed = new Discord.MessageEmbed()
            .setColor('ORANGE')
            .setTitle('Queue')
            .setDescription(qs);

        message.channel.send(embed);
    } else if (args[0] === "connect") {
        const c = msg.member.voice.channel;
        if (!c) return msg.reply('Your not in a channel');
        client.voice.joinChannel(c);
    } else if (args[0] === "disconnect") {
        queue.clear();
        client.voice.connections.array().forEach(e => {
            e.disconnect();
        })
    } else {
        return message.reply("Invalid action. You need to choose an action : play/stop/skip/queue/connect/disconnect");
    }
}

function play(message, song, queue) {
    //const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(message, serverQueue.songs[0], queue);
        })
        .on("error", error => console.error(error));
    // dispatcher.setVolumeLogarithmic((db.get(`${message.guild.id}_volume`) || 10) / 5);
    console.log(serverQueue.volume);
    // console.log((db.get(`${message.guild.id}_volume`) || 5) / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}
module.exports.help = {
    name: "music",
    aliases: [""]
}