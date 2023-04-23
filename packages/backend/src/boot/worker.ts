import cluster from 'node:cluster';
import { initDb } from '../db/postgre.js';

/**
 * Init worker process
 */
export async function workerMain() {
	await initDb();

	// start server
	await import('../server/index.js').then(x => x.default());
	await import('../server/index.js').then(x => x.bootupCompatibleServer_v12); //v12 compatible server

	// start job queue
	import('../queue/index.js').then(x => x.default());

	if (cluster.isWorker) {
		// Send a 'ready' message to parent process
		process.send!('ready');
	}
}
