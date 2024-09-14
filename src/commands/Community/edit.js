const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edit')
        .setDescription('Edit an existing quote.')
        .addStringOption(option =>
            option.setName('oldquote')
                .setDescription('The old quote text to edit')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('newquote')
                .setDescription('The new quote text')
                .setRequired(true)),
    async execute(interaction) {
        const oldQuoteText = interaction.options.getString('oldquote');
        const newQuoteText = interaction.options.getString('newquote');
        const userId = interaction.user.id;

        // Load quotes.json file
        const quotesFilePath = path.join(__dirname, '../../quotes.json');
        if (!fs.existsSync(quotesFilePath)) {
            return interaction.reply({ content: 'No quotes have been added yet.', ephemeral: true });
        }

        const quotes = JSON.parse(fs.readFileSync(quotesFilePath, 'utf8'));

        // Find the quote to edit
        const userQuotes = quotes[userId] || [];
        const quoteIndex = userQuotes.findIndex(q => q.text === oldQuoteText);

        if (quoteIndex === -1) {
            return interaction.reply({ content: 'Quote not found.', ephemeral: true });
        }

        // Update the quote
        userQuotes[quoteIndex].text = newQuoteText;
        userQuotes[quoteIndex].date = new Date().toISOString(); // Update the date to now
        fs.writeFileSync(quotesFilePath, JSON.stringify(quotes, null, 2));

        const embed = new EmbedBuilder()
            .setTitle('Quote Updated')
            .setDescription(`Successfully updated the quote:\n\n**"${oldQuoteText}"**\nTo:\n**"${newQuoteText}"**`)
            .setColor(interaction.user.displayHexColor || '#00AE86')
            .setFooter({ text: `Date: *${new Date().toLocaleDateString('en-US')}*` });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
