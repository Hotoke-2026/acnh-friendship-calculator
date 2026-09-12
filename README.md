# Boilerplate: Fullstack with Sass

## Setup

### What's included

This repo includes:

* villager friendship tracking with API endpoints and database storage
* multi-page routing with React Router v7
* Auth0 authentication integration
* Nookipedia API proxy for item and villager search
* database persistence with Knex.js and SQLite
* configuration for Vitest and testing library
* configuration for server-side debugging in VS Code
* configuration for preprocessing Sass

### Installation

#### **From the Github UI**

See the instructions [here](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template) to use Github's feature to create a new repo from a template.

```
git clone [your-project-ssh-address]
cd [your-project-name]
npm install # to install dependencies
npm run dev # to start the dev server
```

You can find the server running on [http://localhost:3000](http://localhost:3000) and the client running on [http://localhost:5173](http://localhost:5173).

### Environment variables

Copy `.env.example` to `.env` and set the Auth0 client and server values for authentication. The client needs `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID`; the server needs the matching `AUTH0_AUDIENCE` and `AUTH0_ISSUER_BASE_URL`. Set `NOOKIPEDIA_API_KEY` to enable villager and clothing searches; keep this value server-side and do not give it a `VITE_` prefix.

---
[Provide feedback on this repo](https://docs.google.com/forms/d/e/1FAIpQLSfw4FGdWkLwMLlUaNQ8FtP2CTJdGDUv6Xoxrh19zIrJSkvT4Q/viewform?usp=pp_url&entry.1958421517=boilerplate-fullstack)
