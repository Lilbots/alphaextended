const Discord = require('discord.js')
const fs = require('fs');
const zip = require('node-zip');
const archiver = require('archiver');


module.exports.run = async(client, message, args, prefix) => {
    if (message.author.id == "690733972883243008") {
        await zipDirectory(__dirname + "/backups", __dirname + "/temp/back.zip");
        await message.author.send(({ files: [{ attachment: __dirname + "/temp/back.zip" }] }))
        await fs.unlinkSync(__dirname + "/temp/back.zip")
    }
}

/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
async function zipDirectory(source, out) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(out);

    return new Promise((resolve, reject) => {
        archive
            .directory(source, false)
            .on('error', err => reject(err))
            .pipe(stream);

        stream.on('close', () => resolve());
        archive.finalize();
    });
}

module.exports.help = {
    name: "bckcheck",
    aliases: [""]
}