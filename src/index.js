const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000; // Port for the Express server

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] }); 
client.commands = new Collection();

require('dotenv').config();

// Load functions, events, and commands
const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    // Initialize functions, events, and commands
    for (const file of functions) {
        require(`./src/functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");

    // Log in to Discord
    client.login(process.env.token);
})();

// Middleware to serve static files
app.use(express.static('public'));

// Endpoint to get user info
app.get('/api/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await client.users.fetch(userId);
        res.json({
            username: user.username,
            avatarURL: user.displayAvatarURL()
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'User not found or error occurred' });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
