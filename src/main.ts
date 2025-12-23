import { useDiscord } from './discord.js';

try {
	await useDiscord();
	process.exit(0);
} catch (error) {
	console.error(error);
	process.exit(1);
}
