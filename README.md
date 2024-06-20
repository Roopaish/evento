# Evento

## Features
- [X] Create Events, Edit and Publish
- [X] Search, Find new events with filters
- [X] Event creator can invite people to join the event as a team member
- [X] Event creator and team can discuss event related things through chat in realtime
- [X] Event creator can create and assign tasks to the team memebers in boards and cards
- [X] Event creator can create job/gigs posting for event
- [X] Job seeker can apply for the job/gigs listed in each event, event creator can view and select or reject them
- [ ] Event creator can create a seat mapping with labels and prices
- [ ] Buy tickets for a paid event with seat selection
- [ ] Event recommendation system according to user preferences
- [ ] Publish separate website with new subdomain for each event, with own branding
- [ ] Integrate facebook and instagram apis to directly share stuffs about the event
- [ ] Analytics of event, how many people visited, are interested, paid for tickets etc.

## How to run

- `npm install -g pnpm`
- `pnpm install`
- `pnpm prepare`
- On linux only: `chmod ug+x .husky/*`
- Copy .env.example to .env and fill the values
  - For the Email part, replace `noreply@example.com` with your email, and replace password with your app password which can be generated from your `Manage Google Account > Security > 2 Factor Authentication > App Passwords`
  - [Database](#database---postgresql)
- `pnpm dev:next` to run the next.js server
- `pnpm dev:wss` to run the websocket server
- `pnpm dev` to run both at once
- `npx prisma db seed` to seed the database

## Database - Postgresql

Ways to create prostgres database to work on

1. Using docker

- Install Docker Engine (Desktop/CLI only)
- Fill the postgresql values in .env file

```env
 POSTGRES_PASSWORD="some-password"
 POSTGRES_USER="admin"
 POSTGRES_DB="evento"
```

- Run docker compose: `sudo docker compose up -d` or `docker-compose up -d`
- Update DATABASE_URL: `postgresql://username:password@host:port/db_name`, so for above env file it will be `postgresql://admin:some-password@localhost:5432/evento`
- Run `pnpm db:push` to sync prisma schema to database

## How to collaborate

1.

- Clone this repo using ssh or https
- Create a new branch from `main`: `git checkout -b new-branch`, this creates a `new-branch` and also switches the branch from `main` to `new-branch`

2.

- Make changes then Commit `git commit -m prefix:Something` and push the branch `git push` (pushing for first time?: `git push -u origin new-branch`)
- Make a PR from `your-branch` to `main`
- If there is no issue, merge it
- If there is issue solve it by discussing with your peer or if you know the impact of changes, do it yourself

// Before starting again 3.

- Save and Commit all the changes in your current branch
- Pull main branch `git pull origin main`
- Merge recent changes from main to `your-branch`: `git merge main`
- Repeat 2

## The Stack

- next.js app directory
- next-auth: for authentication
- trpc: to make apis and consume them using react-query
- prisma: to work with database
- shadcn/ui and tailwindCSS: styling
- zustand: manage global state
- husky setup with lint-staged: Manage lint conventions

### Commit Lint Conventions

- build: When making changes related to build system or tools.
- chore: General maintenance or tasks that aren’t user-facing.
- ci: Changes to Continuous Integration (CI) configuration or scripts.
- docs: Updates or additions to documentation.
- feat: New feature additions or enhancements.
- fix: For bug fixes or resolving issues.
- perf: Changes aimed at improving performance.
- refactor: Code changes that don’t affect external behavior but enhance code structure.
- revert: Reverting previous commits.
- style: Changes in code style or formatting (not affecting functionality).
- test: Adding or modifying tests.

> Examples

- build: `build: Update webpack configuration`
- chore: `chore: Clean up unused files`
- ci: `ci: Configure GitHub Actions for deployment`
- docs: `docs: Update installation guide`
- feat: `feat: Add user authentication feature`
- fix: `fix: Resolve issue with user login`
- perf: `perf: Improve caching mechanism`
- refactor: `refactor: Simplify error handling`
- revert: `revert: Revert changes in user profile component`
- style: `style: Format code according to style guide`
- test: `test: Add unit tests for API endpoints`

## Code snippets

```

```
