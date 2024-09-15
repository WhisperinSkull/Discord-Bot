document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the user ID from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    if (!userId) {
        console.error("No user ID found in the URL.");
        document.getElementById("userId").textContent = "No user ID found.";
        return;
    }

    // Update the userId span
    document.getElementById("userId").textContent = `#${userId}`;

    const botToken = process.env.BOT_TOKEN; // Ensure this is correctly set in .env

    // Fetch user information from Discord API
    fetch(`https://discord.com/api/v10/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bot ${MTI4MzYzMDEwNzY2NzMzNzI3OA.GYYQNB.QNSxOOTMsQXwUOqNr7HhyUg5lccD1_3AdT08Ms}` // Replace with your bot token
        }
    })
    .then(response => response.json())
    .then(userInfo => {
        if (!userInfo || !userInfo.username) {
            console.error("No user information found.");
            document.getElementById("usernameid").textContent = "Username not found";
            return;
        }

        // Update the username with the fetched display name
        document.getElementById("usernameid").textContent = userInfo.username;

        // Update the profile picture
        if (userInfo.avatar) {
            const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${userInfo.avatar}.png`;
            document.querySelector(".profile-pic").style.backgroundImage = `url(${avatarUrl})`;
        }
    })
    .catch(error => {
        console.error('Error fetching user information:', error);
    });

    // Fetch quotes.json and process the data
    fetch('../src/quotes.json')
        .then(response => response.json())
        .then(data => {
            if (!data[userId]) {
                console.error("No quotes found for this user.");
                return;
            }

            const userQuotes = data[userId];
            const totalQuotes = userQuotes.length;
            
            if (totalQuotes === 0) {
                console.error("No quotes found for this user.");
                return;
            }

            // Sort the user's quotes by date
            userQuotes.sort((a, b) => new Date(a.date) - new Date(b.date));

            const lastQuote = userQuotes[userQuotes.length - 1];
            const wordCounts = userQuotes.map(q => q.text.split(' ').length);
            const charCounts = userQuotes.map(q => q.text.length);
            const longestQuote = userQuotes.reduce((max, q) => q.text.length > max.text.length ? q : max, userQuotes[0]);
            const shortestQuote = userQuotes.reduce((min, q) => q.text.length < min.text.length ? q : min, userQuotes[0]);

            // Average length of quotes
            const avgWords = (wordCounts.reduce((sum, count) => sum + count, 0) / totalQuotes).toFixed(2);
            const avgChars = (charCounts.reduce((sum, count) => sum + count, 0) / totalQuotes).toFixed(2);

            // Most common word
            const wordFrequency = {};
            userQuotes.forEach(quote => {
                const words = quote.text.split(/\s+/).map(word => word.toLowerCase());
                words.forEach(word => {
                    if (!['the', 'and', 'of', 'a', 'to', 'is'].includes(word)) { // Ignoring common words
                        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
                    }
                });
            });
            const mostCommonWord = Object.keys(wordFrequency).reduce((a, b) => wordFrequency[a] > wordFrequency[b] ? a : b, "");

            // Quote frequency
            const quoteFrequency = (totalQuotes / ((new Date(lastQuote.date) - new Date(userQuotes[0].date)) / (1000 * 60 * 60 * 24))).toFixed(2);

            // Most quoted day of the week
            const dayCounts = Array(7).fill(0); // Sunday to Saturday
            userQuotes.forEach(quote => {
                const day = new Date(quote.date).getDay();
                dayCounts[day]++;
            });
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const mostQuotedDay = daysOfWeek[dayCounts.indexOf(Math.max(...dayCounts))];

            // Update the HTML elements with the gathered data
            document.getElementById("firstQuoteDate").textContent = new Date(userQuotes[0].date).toLocaleDateString('en-US');
            document.getElementById("recentQuote").textContent = `"${lastQuote.text}"`;
            document.getElementById("longestQuote").textContent = `"${longestQuote.text}"`;
            document.getElementById("shortestQuote").textContent = `"${shortestQuote.text}"`;
            document.getElementById("totalQuotes").textContent = totalQuotes;
            document.getElementById("quoteFrequency").textContent = `${quoteFrequency} Days/Quote`;
            document.getElementById("avgWords").textContent = avgWords;
            document.getElementById("avgChars").textContent = avgChars;
            document.getElementById("mostCommonWord").textContent = mostCommonWord;
            document.getElementById("mostQuotedDay").textContent = mostQuotedDay;
        })
        .catch(error => {
            console.error('Error fetching or processing the quotes.json file:', error);
        });
});
