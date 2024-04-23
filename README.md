# Evento

## How to run

- `npm install -g pnpm`
- `pnpm install`
- `pnpm prepare`
- On linux only: `chmod ug+x .husky/*`
- Copy .env.example to .env and fill the values (See below on database setup)
  - For the Email part, replace `noreply@example.com` with your email, and replace password with your app password which can be generated from your `Manage Google Account > Security > 2 Factor Authentication > App Passwords`
- `pnpm dev:next` to run the next.js server
- `pnpm dev:wss` to run the websocket server
- `pnpm dev` to run both at once

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

- Run docker compose: `sudo docker compose up` or `docker-compose up`
- Update DATABASE_URL: `postgresql://username:password@host:port/db_name`, so for above env file it will be `postgresql://admin:some-password@localhost:5432/evento`
- Run `pnpm db:push` to sync prisma schema to database

## How to collaborate

- Clone this repo using ssh or https
- Create a new branch from `dev`: `git checkout -b new-branch`, this creates a `new-branch` and also switches the branch from `dev` to `new-branch`
- Commit and push the branch and its changes to the repo

- Make a PR from `your-branch` to `dev`
- If there is no issue, merge it
- If there is issue solve it by discussing with your peer or if you know the impact of changes, do it yourself
- After that check if it deploys correctly, if it does then make another PR from `dev` to `main`, and repeat above 2 process else fix it

// Before starting again

- Save and Commit all the changes in your current branch
- Switch to `dev`: `git checkout dev` -> `git pull`
- Switch to `your-branch`: `git checkout your-branch`
- Merge recent changes from dev to `your-branch`: `git merge main`

Repeat the process

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
