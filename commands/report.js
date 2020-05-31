const Discord = require('discord.js')
const webhook = require("webhook-discord");

module.exports.run = async(client, message, args, prefix) => {
    const user = message.author.tag;
    const server = message.guild.name;
    const reason = args.join(" ");
    if (!args[0]) {
        return message.reply("You cant send a report without a reason");
    }
    if (!reason) {
        return message.reply("You cant send a report without a reason");
    }
    const Hook = new webhook.Webhook("https://discordapp.com/api/webhooks/716668121313968239/RkeSfZWluakhHpKCQuxRPQVkoI2htU6wBH3DtU5xFTHk90ufBvxFRhMJFUGinsg4rqK-");
    const msg = new webhook.MessageBuilder()
        .setName('Alpha Extended')
        .setTitle("Bug report")
        .addField("User", user, true)
        .addField("Server", server, true)
        .addField("Reason", reason);
    Hook.send(msg).catch(err2 => client.logger.error(err2));
    message.reply("Thanks for reporting. That really help the developers the find the bugs");
}

module.exports.help = {
    name: "report",
    aliases: ["reportbug"]
}