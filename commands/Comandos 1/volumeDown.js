module.exports = {
    name: 'volume',
    aliases: ['v', 'set', 'set-volume'],
    inVoiceChannel: true,
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return console.log("Fila vazia")//message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
        const volume = parseInt(args[0])
        if (isNaN(volume)) return console.log("Numero invalido")//message.channel.send(`${client.emotes.error} | Please enter a valid number!`)
        queue.setVolume(volume)
        console.log("Volume setado")//message.channel.send(`${client.emotes.success} | Volume set to \`${volume}\``)
    }
}
