const { Canvas } = require('canvas-constructor');
const { MessageAttachment } = require('discord.js');


module.exports = function capchat(text) {
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
    const filename = `capchat-preview.png`;
    const attachment = new MessageAttachment(buffer, filename);
    return attachment;
};