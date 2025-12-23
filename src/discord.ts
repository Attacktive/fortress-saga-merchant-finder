import { Client } from 'discord.js';
import { getLastCoordinates } from './coordinates.js';

export const useDiscord = async () => {
	const TOKEN = process.env.TOKEN;
	if (!TOKEN) {
		throw new Error('The environment variable "TOKEN" is not found in environment variables!');
	} else if (TOKEN.includes('...')) {
		throw new Error('You need to provide the environment variable "TOKEN"!');
	}

	const CHANNEL_ID = process.env.CHANNEL_ID;
	if (!CHANNEL_ID) {
		throw new Error('The environment variable "CHANNEL_ID" is not found in environment variables!');
	} else if (CHANNEL_ID.includes('...')) {
		throw new Error('You need to provide the environment variable "CHANNEL_ID"!');
	}

	let succeed: () => void;
	let fail: (_error: unknown) => void;
	const finished: Promise<void> = new Promise((resolve, reject) => {
		succeed = resolve;
		fail = reject;
	});

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
				if (channel) {
					if (channel.isSendable()) {
						await channel.send(`\`${coordinates}\``);
					} else {
						fail(new Error(`Channel is not sendable: ${CHANNEL_ID}`));
					}
				} else {
					fail(new Error(`Channel not found: ${CHANNEL_ID}`));
				}
			} catch (error) {
				fail(error);
			} finally {
				await client.destroy();

				succeed();
			}
		}
	);

	await client.login(TOKEN);

	await finished;

	return client;
};
