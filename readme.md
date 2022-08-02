# DEPRECATED
This project is deprecated and has not been maintained or ran in years. However, while it was functioning, it ran smoothly. Feel free to look and use some of the features in here, I do not mind.

# Squad Whitelisting Bot
## Requirements
* NodeJS
* NPM

## Install Guide
 1. After installing NodeJS and NPM, copy the contents of this Github Directory to wherever folder you want to host the bot in. 
 2. Rename example-config.json to config.json, and put the appropriate values where they should go. If you're using environment vars, use the same names provided in the example-config.json fields.
 3. Run npm init to install required packages.
 4. Run npm start to start the Bot.

To get a Discord Bot Token, look here - https://discordpy.readthedocs.io/en/latest/discord.html. To get a Steam API Key, look here - https://steamcommunity.com/dev/apikey.  

## Features
### Whitelisting
This bot is made to ensure the Steam 64 ID is always valid and to allow the user greater flexibility with their input. They can either simply input a Steam 64 ID or simply input a Steam Profile URL and the bot will parse the URL and grab the Steam 64 ID from that URL. After ensuring the Steam 64 ID is valid, it will write to the text file whitelist.txt formatted for server use. Added to each line is a comment with the Steam username attached to that Steam 64 ID. You can now point to this file in RemoteAdminList.cfg. This command can be run anywhere.

Example - `!whitelist 76561198302550775` or `!whitelist https://steamcommunity.com/id/jenkitos/` where `!` is actually your specified command prefix.
