import { db } from "$lib/server/db";
import { eq, desc } from "drizzle-orm";
import { events } from "$lib/server/db/schema";
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  if (!env.OWNER_ID) return { events: [] };
  const ownerEvents = await db
    .select()
    .from(events)
    .where(eq(events.userId, env.OWNER_ID))
    .orderBy(desc(events.createdAt), desc(events.id));
  return { events: ownerEvents };
};
