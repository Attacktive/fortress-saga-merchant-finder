import { Client } from 'discord.js';
import { getLastCoordinates } from './coordinates.js';

export const useDiscord = async () => {
	const TOKEN = process.env.TOKEN;
	if (!TOKEN) {
		throw new Error('The environment variable "TOKEN" is not found in environment variables!');
	}

	const CHANNEL_ID = process.env.CHANNEL_ID;
	if (!CHANNEL_ID) {
		throw new Error('The environment variable "CHANNEL_ID" is not found in environment variables!');
	}

	const client = new Client({ intents: [] });

	client.once(
		'clientReady',
		async () => {
			const { user } = client;

			if (user) {
				console.log(`🤖 Discord bot logged in as ${user?.tag}!`);
			} else {
				console.log('🤖 Discord bot logged in.');
			}

			try {
				const coordinates = getLastCoordinates();
				const channel = await client.channels.fetch(CHANNEL_ID);
				if (!channel) {
					throw new Error(`Channel not found: ${CHANNEL_ID}`);
				}

				if (!channel.isSendable()) {
					throw new Error(`Channel is not sendable: ${CHANNEL_ID}`);
				}

				await channel.send(`\`${coordinates}\``);
			} finally {
				await client.destroy();
			}
		}
	);

	await client.login(TOKEN);

	return client;
};
