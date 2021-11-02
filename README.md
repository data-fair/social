# <img alt="Data FAIR logo" src="https://cdn.jsdelivr.net/gh/data-fair/data-fair@master/public/assets/logo.svg" width="40"> @data-fair/social

*A service for social interactions and collaboration in the data-fair ecosystem.*

## Development environment

This project requires a recent yarn version:

    npm i -g yarn

Install dependencies and launch service dependencies with docker-compose:

    yarn
    docker-compose up -d

Run the 2 development servers with these commands in separate shells:

    yarn run dev-server
    yarn run dev-client

When both servers are ready, go to [http://localhost:5608](http://localhost:5608) and chose an account in `test/resources/users.json` to login with its email.
