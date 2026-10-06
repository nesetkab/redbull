import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  let id = event.cookies.get('uid');
  if (!id) { id = crypto.randomUUID(); event.cookies.set('uid', id, { path: '/', maxAge: 60 * 60 * 24 * 365 }); }
  event.locals.userId = id;
  return resolve(event);
};

