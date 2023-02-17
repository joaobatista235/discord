const Discord = require("discord.js")
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js')
const buttons = require("./commands/buttons/buttons")
const autoplay = require("./commands/Comandos 1/autoplay")
const client = new Discord.Client({
    intents: [
        1,
        512,
        32768,
        2,
        128,
        "GuildVoiceStates"
    ]
});

const { DisTube } = require('distube')
const simsimi = require('simsimi')({
    key: 'g_d.8~PWF1h43qWDhu3AJjxfJhx8bVXrX44OObOl',
});

client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
})

const config = require("./config.json");
const fs = require("fs");


client.login(config.token)

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync(`./commands/`);

fs.readdirSync('./commands/').forEach(local => {
    const comandos = fs.readdirSync(`./commands/${local}`).filter(arquivo => arquivo.endsWith('.js'))

    for (let file of comandos) {
        let puxar = require(`./commands/${local}/${file}`)

        if (puxar.name) {
            client.commands.set(puxar.name, puxar)
        }
        if (puxar.aliases && Array.isArray(puxar.aliases))
            puxar.aliases.forEach(x => client.aliases.set(x, puxar.name))
    }
});
const eu = '698765808695771166'
const edv = '436647953055219723'
const gaby = '275917034838032395'
let cnl = null

client.on("messageCreate", async (message) => {
    const finoUrl = 'https://www.youtube.com/watch?v=yxq0ZnjEENs'

    const reacoes = ['❤️', '🧡', '💛'];

    if (message.author == gaby || message.author == edv) {
        for (let i = 0; i < reacoes.length; i++) {
            message.react(reacoes[i]);
        }
        simsimi(message.content).then(response => {
            message.reply(response);
        }, e => console.error('simsimi error:', e));
    }

    let prefix = config.prefix;

    if (message.author.bot) return;
    if (message.channel.type === Discord.ChannelType.DM) return;

    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    let cmd = args.shift().toLowerCase()
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd)
    if (!command) command = client.commands.get(client.aliases.get(cmd))
    //console.log(command)
    try {
        command.run(client, message, args)
        cnl = message
    } catch (err) {
        console.error('Erro:' + err);
    }

});

const btnComponent = [
    {
        type: 1,
        components: [buttons.previous, buttons.pause, buttons.next],
    },
    {
        type: 1,
        components: [buttons.autoplay, buttons.volumeDown, buttons.volumeUp]
    }
]

const btnOn = '✅ Autoplay'
const btnOff = '❌ Autoplay'
let bool = false

const voltar = '▶️ Resume'
const pausar = '⏸️ Pausar'
let boolPause = false

client.on(Events.InteractionCreate, async interaction => {

    if (interaction.customId === 'autoplay') {
        bool = bool ? false : true
        if (bool) buttons.autoplay.setLabel(btnOn)
        else buttons.autoplay.setLabel(btnOff)
    }

    if(interaction.customId === 'pause'){
        boolPause = boolPause ? false : true
        if (boolPause) buttons.pause.setLabel(voltar)
        else buttons.pause.setLabel(pausar)
    }

    let command = client.commands.get(interaction.customId)
    try {
        command.run(client, cnl)
        await interaction.update({ components: btnComponent });
    } catch (err) {
        console.error('Erro:' + err);
    }

});

// LISTENERS DO PLAYER DE MUSICA
client.distube
    .on('playSong', (queue, song) => {// MUSICA COMECA
        let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: `🟣 ${client.user.username}`, iconURL: cnl.author.iconURL })
            .setTitle(`Tocando ${song.name}.`)
            .setThumbnail(song.thumbnail)
            .addFields(
                { name: 'Musica', value: `${song.name}`, inline: true },
                { name: 'Tempo', value: `${song.formattedDuration}`, inline: true }
            )
            .setDescription(`🎶`);

        cnl.channel.send({
            embeds: [embed],
            components: btnComponent
        })
    })
    .on('addSong', (queue, song) => {// MUSICA ADICIONADA NA FILA
        let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setTitle(`Adicionada a fila`)
            .setDescription(`${song.name}`)
        cnl.channel.send({ embeds: [embed] })
    })
    .on('error', (textChannel, e) => {
        let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setTitle(`Erro`)
            .setDescription(`${e.message.slice(0, 2000)}`)
        cnl.channel.send({ embeds: [embed] })
    })
    .on('finish', queue => queue.textChannel?.send('Finish queue!'))
    .on('finishSong', queue =>
        queue.textChannel?.send('Finish song!'),
    )
    .on('disconnect', queue =>
        queue.textChannel?.send('Disconnected!'),
    )
    .on('empty', queue =>
        queue.textChannel?.send(
            'The voice channel is empty! Leaving the voice channel...',
        ),
    )

client.on("ready", () => {
    console.log(`🔥 Estou online em ${client.user.username}!`)

    client.users.fetch(edv, false).then((user) => {
        user.send('Saia do tinder de imediato');
    });
})
