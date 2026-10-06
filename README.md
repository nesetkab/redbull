![caffeine tracker - to track how unhealthy i am](static/screenshot.jpg)

**Try it: [redbull.nesetk.com](https://redbull.nesetk.com)** · **See my wall: [redbull.nesetk.com/neset](https://redbull.nesetk.com/neset)**

## What?
This is an online web app that keeps track of my caffeine intake: Red Bulls, coffee, Monsters, whatever. Other methods are too annoying, and not as funny.

Anyone can use it. You get your own shelf the moment you open the site, no account needed, and nobody else can see or touch your drinks. You can also peek at my wall to see how bad it's gotten.

## Why?
I drink a LOT of Red Bulls, and wanted a sure-fire way to see when I'm the most stressed and unhealthy. I know some people have Red Bull walls, but I don't always have the ability to keep my cans. Now, I can build a digital Red Bull wall :).

## How?
I use Svelte for the front-end, Typescript for the back end, and PostgreSQL for data storage. I use Vercel for hosting and Neon for the database.
All icons and branding (including the Red Bull icons in the website) are made by me in Figma.

## Running it locally
You need Node and a Postgres database.

```sh
npm install
echo 'DATABASE_URL="postgres://user:pass@localhost:5432/caffeine"' > .env
npx drizzle-kit push
npm run dev
```
