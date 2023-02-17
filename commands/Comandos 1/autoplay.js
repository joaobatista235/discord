const buttons = require("../buttons/buttons")

module.exports = {
  name: 'autoplay',
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return console.log("Nenhuma fila encontrada")//`${client.emotes.error} | There is nothing in the queue right now!`)
    let turnOnAutoplay = queue.toggleAutoplay()
  },
}
