# Lentics

A Turborepo with Lens data Analytics (postgres database) + Next.js powered by docker and docker-compose.

## What's inside?

This turborepo uses [Yarn](https://classic.yarnpkg.com/) as a package manager. It includes the following packages/apps:

### Apps and Packages

- `api`: backend
- `web`: frontend
- `data`: constants shared by apps
- `db`: sequelize models shared by apps
- `ui`: a stub React component library shared by apps
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

## Prerequisites
Please make sure you have Docker and docker-compose installed in your machine. Please refer here to install them :

1. [Docker](https://docs.docker.com/engine/install/) installation
2. [Docker compose](https://docs.docker.com/compose/install/) installation

## Getting Started
1. Clone this repository and change directory:
```bash
git clone git@github.com:codingtalent/lentics.git
cd lentics
```
2. Setup web/api configuration (`.env`). Create a .env file which stores postgres configuration, based on the .env.example file:
```bash
cd apps/web
cp .env.example .env
cd ../api
cp .env.example .env
```
3. To develop all apps and packages, run the following command:
```
cd lentics
docker-compose up -d
```
4. Default access URL
```
http://localhost: 3000  #web
http://localhost: 3001  #api
```
5. To build all apps and packages, run the following commands:
```bash
docker exec -it lentics_turbo_1 /bin/sh
```
Then run:
```bash
yarn build
```

**To avoid build failures, please stash the changes for package.json before build new container. Please also submit new files in the npm-packages-offline-cache directory to git if package.json has new dependencies.**


## Useful Links
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference) for turbo Command-Line Reference
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com)
- [wagmi / ethers](https://wagmi.sh/) for Ethereum Hooks
- [Apollo](https://www.apollographql.com/) for GraphQL server and client
- [Sequelize](https://sequelize.org/docs/v6/)


