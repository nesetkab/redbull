import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const password = String(form.get('password') ?? '');

    if (!env.OWNER_ID || !env.OWNER_PASSWORD || password !== env.OWNER_PASSWORD) {
      return fail(401, { error: 'wrong password :(' });
    }

    cookies.set('uid', env.OWNER_ID, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    redirect(303, '/');
  },
};
