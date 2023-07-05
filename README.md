# Web Reactionz &mdash; <i>global reactions for the Web</i>

<img src="./public/logo.svg" align="right"
     alt="Web Reactionz logo" width="80" height="80">

[Web Reactionz](https://webreactionz.com) is a platform enabling you to add customisable anonymous 'reaction buttons' to any website in less than a minute.

Features:

- **Lightweight** & **easy to use** (insert a single `<script>` tag to any webpage)
- **Anonymous** reactions
- **Authentication** with magic link/any OAuth provider
- **Multiple reactions** support (e.g., Medium 'claps')
- Customisable emoji to capture **any** reaction 😮👍😍👎👏🤮
- Built-in **layouts & themes** to fit any site
- **No-code configuration** UI
- Per-page **analytics** for reactions over time and per day
- Support for **advanced configuration** via JavaScript
- **Open-source** & self-hostable

[**A hosted version of Web Reactionz is available for free at webreactionz.com**](https://webreactionz.com).

Read on if you are looking to learn how it works, contribute to the code, or self-host!

## How it works

1. Website owners create a 'site' in the Web Reactionz Dashboard which refers to a single hostname (e.g., `myblog.com`)
2. Website owners include the Web Reactionz client script on their webpage(s) in the form `<script async defer src='https://cdn.jsdelivr.net/gh/intersect-software/web-reactionz@1/public/setup.min.js' data-siteid='x' data-domselector='#content' />`
3. The script fetches the configuration settings for the provided site ID, and renders the reaction widget/emojis as per these settings
4. Website users/visitors interact with the reaction buttons
5. Website owners can view per-page reaction statistics in the Web Reactionz Dashboard

**For more information on configuration and the JavaScript API, see [the support and docs page](https://webreactionz.com/support).**

## Architecture

This is a [Next.JS](https://nextjs.org/) app that uses [PostgreSQL](https://www.postgresql.org/) for persistent data storage, [Redis](https://redis.io/) to cache hashed IP addresses to limit the number of reactions per time period from an IP, [Prisma](http://prisma.io/) as an ORM for PostgreSQL, and [NextAuth.js](https://next-auth.js.org/) to facilitate authentication via JWTs.

[The main static JavaScript script](./setup.js) should be included in any web page wanting to use Web Reactionz. This creates the reaction buttons and handles calls to the reactions API to increment counts.

The API can be found in [`app/api`](./app/api):

- The Dashboard API ([`app/api/dashboard/sites`](./app/api/dashboard/sites/)) is only accessible to the authenticated user, intended only for the web dashboard.
- The Reactions API ([`app/api/sites/[siteId]`](./app/api/sites/%5BsiteId%5D/)) is accessible from webpages whose `Origin` or `Referer` header matches the respective Site ID's hostname configuration.

## Authentication

Authentication is only required for the web Dashboard and its API.

By default, only "magic link" authentication is configured using [NextAuth.js](https://next-auth.js.org/).

However, any other OAuth provider (or even a classic username-password setup) can be easily configured by adding [the appropriate NextAuth.js `Provider`](https://next-auth.js.org/providers/) to [`./app/api/auth/[...nextauth]/route.ts`](./app/api/auth/%5B...nextauth%5D/route.ts).

## Development

Requirements: Node.JS v18+, (P)NPM, [Docker, Docker Compose].

1. Install Node dependencies

   ```bash
   pnpm install
   ```

2. Define environment secrets

   ```bash
   cp .env.example .env
   # Edit the secrets in .env
   ```

3. Spin up PostgreSQL and Redis containers in Docker

   ```bash
   docker-compose up -d
   ```

   Note: this can be done outside of Docker too, if you wish.

4. Start the web-app
   ```bash
   pnpm dev
   ```

The web-app should be accessible on [localhost:3000](http://localhost:3000) by default.

## Installation (for production)

Requirements: Docker, Docker Compose.

1. Define environment secrets

   ```bash
   cp .env.example .env
   # Edit the secrets in .env
   ```

2. Spin up the containers
   ```bash
   docker-compose -f docker-compose-prod.yml
   ```

The web-app will be exposed on [localhost:3000](http://localhost:3000) by default.

If you do not wish to use Docker, you can follow the development steps above, but instead of `pnpm dev`, run `pnpm build` followed by `pnpm start:migrate` (see the [`Dockerfile`](./Dockerfile) for more information on how to build manually).

To enable all features when self-hosting, set the `User.paidPlanEnd` field in PostgreSQL to be a date in the future (e.g., `2030-01-01`).

# License

This project is open-source under the [GNU Affero General Public License Version 3 (AGPLv3) or any later version](./LICENSE).
