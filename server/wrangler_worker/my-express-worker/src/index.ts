/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { AutoRouter } from 'itty-router'
import { getAssetFromKV, NotFoundError } from '@cloudflare/kv-asset-handler';


const router = AutoRouter()

// Serve static assets (fallback for requests that don't match the API routes)
async function handleStaticFiles(request: Request): Promise<Response> {
	try {
	  // Mock an event object with a waitUntil method
	  const mockEvent = {
		request,
		waitUntil: (promise: Promise<any>) => promise,
	  };

	  return await getAssetFromKV(mockEvent);
	} catch {
	  return new Response('404 Not Found', { status: 404 });
	}
  }
  const worker = {
	async fetch(request: Request): Promise<Response> {
	  const response = await router.handle(request).catch(() => null);

	  if (response) {
		return response;
	  }

	  return handleStaticFiles(request); // Pass the request, handled with a mock event
	},
  };

  export default worker
