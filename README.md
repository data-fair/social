# <img alt="Data FAIR logo" src="https://cdn.jsdelivr.net/gh/data-fair/data-fair@master/public/assets/logo.svg" width="40"> @data-fair/social

*A service for social interactions and collaboration in the data-fair ecosystem.*

## Sponsors

| | Click [here to support the development of this project](https://github.com/sponsors/koumoul-dev). |
|-|-|
| [<img alt="Koumoul logo" src="https://koumoul.com/static/logo-slogan.png" height="40">](https://koumoul.com) | [Koumoul](https://koumoul.com) develops the Data Fair ecosystem and hosts it as an online service. |
| [<img alt="Dawizz logo" src="https://dawizz.fr/logo-Dawizz-all-about-your-data-home.png" height="40">](https://dawizz.fr) | [Dawizz](https://dawizz.fr) uses the Data Fair ecosystem inside its platform and supports its development. |

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
