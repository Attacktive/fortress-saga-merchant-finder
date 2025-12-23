import { useDiscord } from './discord.js';
import { createServer } from 'http';

const PORT = process.env.PORT || 3000;

const server = createServer((request, response) => {
	if (request.url === '/') {
		response.writeHead(200, { 'Content-Type': 'application/json' });
		response.end(JSON.stringify({ status: 'ok', service: 'top-heroes-auto-redeemer' }));
	} else {
		response.writeHead(404);
		response.end('Not Found');
	}
});

server.listen(PORT, () => console.log(`🏥 Health check server running on port ${PORT}`));

const exitWith = (code: number) => server.close(() => process.exit(code));

try {
	await useDiscord();
	exitWith(0);
} catch (error) {
	console.error(error);
	exitWith(1);
}
