import { predictCoordinates } from './discord.js';

try {
	await predictCoordinates();
} catch (error) {
	console.error(error);
	process.exitCode = 1;
}
