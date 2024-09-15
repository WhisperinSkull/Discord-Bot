const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Get a link to your quote profile page'),

    async execute(interaction) {
        const userId = interaction.user.id;  // Get the user's Discord ID
        const profileUrl = `http://127.0.0.1:3000/public/index.html?userId=${userId}`;  // Include userId in the URL

        const embed = new EmbedBuilder()
            .setColor('#7289DA')  // Set your embed color
            .setTitle(`${interaction.user.username}'s Quote Profile`)
            .setDescription(`[Click here to view your profile](${profileUrl})`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
