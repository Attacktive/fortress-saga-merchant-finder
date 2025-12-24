import { once } from 'node:events';
import { Client } from 'discord.js';
import { getLastCoordinates } from './coordinates.js';

const predictCoordinates = async () => {
	const token = process.env.TOKEN;
	const channelId = process.env.CHANNEL_ID;

	if (!token || token.includes('...')) {
		throw new Error('You need to provide the environment variable "TOKEN"!');
	}

	if (!channelId || channelId.includes('...')) {
		throw new Error('You need to provide the environment variable "CHANNEL_ID"!');
	}

	const client = new Client({ intents: [] });

	try {
		await client.login(token);
		await once(client, 'clientReady');

		const { user } = client;
		if (user) {
			console.log(`🤖 Discord bot logged in as ${user.tag}!`);
		} else {
			console.log('🤖 Discord bot logged in.');
		}

		const coordinates = getLastCoordinates();
		const channel = await client.channels.fetch(channelId);

		if (!channel) {
			throw new Error(`Channel not found: ${channelId}`);
		}

		if (!channel.isSendable()) {
			throw new Error(`Channel is not sendable: ${channelId}`);
		}

		await channel.send(`\`${coordinates}\``);
	} finally {
		await client.destroy();
	}
};

export { predictCoordinates };
