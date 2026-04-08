// ============================================================
// Cloud sync endpoint
// Requires Vercel KV to be enabled. Falls back gracefully.
// ============================================================
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

async function getKV() {
  try {
    if (!process.env.KV_URL && !process.env.KV_REST_API_URL) return null;
    const { kv } = await import('@vercel/kv');
    return kv;
  } catch {
    return null;
  }
}

export const GET: RequestHandler = async ({ url }) => {
  const kv = await getKV();
  if (!kv) {
    return json({
      ok: false,
      message: 'Cloud sync not configured. Enable Vercel KV on this deployment to unlock.'
    });
  }
  const code = url.searchParams.get('code');
  if (!code) {
    return json({ ok: true, message: 'KV connected. Provide ?code=XXXX to fetch.' });
  }
  const data = await kv.get(`ppl:${code}`);
  return json({ ok: true, data });
};

export const POST: RequestHandler = async ({ request }) => {
  const kv = await getKV();
  if (!kv) {
    return json({ ok: false, message: 'Cloud sync not configured.' }, { status: 503 });
  }
  const body = await request.json();
  if (!body.code || !body.data) {
    return json({ ok: false, message: 'Missing code or data' }, { status: 400 });
  }
  await kv.set(`ppl:${body.code}`, body.data, { ex: 60 * 60 * 24 * 90 });
  return json({ ok: true });
};
