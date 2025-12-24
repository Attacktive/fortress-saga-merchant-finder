import { useDiscord } from './discord.js';

try {
	await useDiscord();
} catch (error) {
	console.error(error);
	process.exitCode = 1;
}
