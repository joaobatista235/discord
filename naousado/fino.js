const Discord = require("discord.js")

module.exports = {
    name: "fino", // Coloque o nome do seu comando
    aliases: [""], // Coloque sinônimos do nome do comando

    run: async (client, message, args) => {
        console.log(args)
        client.distube.play(message.member.voice.channel, args.join(" ")), {
            member: message.member,
            textChannel: message.channel,
            message
        }
    }
}