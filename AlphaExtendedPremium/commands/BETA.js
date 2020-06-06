const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports.run = async(client, message, args, prefix, queue) => {
    if (db.get(`${message.guild.id}.license.type`) === "Platinium") {
        if (args[0] === "lyrics") {
            /*const serverQueue = queue.get(message.guild.id);
            if (!serverQueue) return message.reply("There is not song playing!");
            // console.log(serverQueue.songs);
            const jsonSong = JSON.parse(JSON.stringify(serverQueue.songs))
            console.log(jsonSong['']);
            const songName = queue.songs[0].title;
            console.log(songName);

            const sentMessage = await message.channel.send(
                'Searching for lyrics...'
            );

            // get song id
            var url = `https://api.genius.com/search?q=${encodeURI(songName)}`;

            const headers = {
                Authorization: `Bearer 2BIBzi-cNGHMC0oqu6HvALtasZW00J-NyPQ4H3xQEMY2MtafP4Rr_Db6DHTqNOVQ`
            };
            try {
                var body = await fetch(url, { headers });
                var result = await body.json();
                const songID = result.response.hits[0].result.id;

                // get lyrics
                url = `https://api.genius.com/songs/${songID}`;
                body = await fetch(url, { headers });
                result = await body.json();

                const song = result.response.song;

                let lyrics = await getLyrics(song.url);
                lyrics = lyrics.replace(/(\[.+\])/g, '');

                if (lyrics.length < 2048) {
                    const lyricsEmbed = new MessageEmbed()
                        .setColor('ORANGE')
                        .setDescription(lyrics.trim());
                    return sentMessage.edit('', lyricsEmbed);
                } else {
                    // lyrics.length > 2048
                    const firstLyricsEmbed = new MessageEmbed()
                        .setColor('ORANGE')
                        .setDescription(lyrics.slice(0, 2048));
                    const secondLyricsEmbed = new MessageEmbed()
                        .setColor('ORANGE')
                        .setDescription(lyrics.slice(2048, lyrics.length));
                    sentMessage.edit('', firstLyricsEmbed);
                    message.channel.send(secondLyricsEmbed);
                    return;
                }
            } catch (e) {
                console.error(e);
                return sentMessage.edit(
                    'Something when wrong, please try again'
                );
            }*/
        } else {
            return message.reply("Invalid BETA feature");
        }
    } else {
        return message.reply("This command is only available if you have a Platinium License");
    }
}

async function getLyrics(url) {
    const response = await fetch(url);
    const text = await response.text();
    const $ = cheerio.load(text);
    return $('.lyrics')
        .text()
        .trim();
}

module.exports.help = {
    name: "BETA",
    aliases: ["beta"]
}