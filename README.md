# portfolioTracker

## General Purpose of the App:

Allow users the ability to track their portfolio, with their chosen stocks, monitoring the individual price changes, returning their profit/loss on their investments, trace the movement of their individual holdings and get a general idea of how their portfolio is doing.

## Features:

- Users are able to login
- Users are able to track their portfolio.
- Users are able to track their and mark it as complete for the month.
- Users are able to see if they have completed a habit for the day and see their most recent completion streak.
- Users are able to delete themself from the app


## Installation & Usage

### Prerequisites
- Docker

### Installation
- Clone or download the repo

### Usage
- Go to the project folder
- Open the bash terminal
- Run: bash _scripts/startDev.sh
- You will find:
  - Client in [localhost:8080](http://localhost:8080/)
  - Server in [localhost:5000](http://localhost:5000/)
- To close the app:
  - Open a new bash terminal in the project folder
  - Run: bash _scripts/stop.sh
- To perfom a complete teardown of the app:
  - Open a new bash terminal in the project folder
  - Run: bash _scripts/teardown.sh
  
## Technologies:

- Non relational database- PostgreSQL
- Node
- Express
- HTML,CSS and JS
- CORS
- AWS
- Nodemon
- BCrypt
- JWT Tokens

## Database Schema
![Database Schema](./readme-src/DB-schema.JPG)

## Client Endpoints

 - `/index.html` Home page and login form page.Does't require token
 - `/index.html#singup` Show the form to register a new user. Doesn't requires token
 - `/portfolio.html` Show the user invest habits. Needs token
 - `/portfolio.html#invest` Show the do an investment form (this form overlap main). Needs Token
 - `/portfolio.html/#sell` Show the sell an investment form (this form overlap main) Needs Token
 - `/portfolio.html/#logout` It triggers the delete of the session token and it returns to the home page 
 - `/error.html` 404 Page not found.


## API Endpoints

### Post 

| Route Name | URL | HTTP Verb | Description |
|-----|----|----|--|
| Create | /buys | POST | User buy new stock |
| Create | /sells | POST | User sold old stock |
| Register | /auth/register | POST | create a new user |
| Login | /auth/login | POST | check if the user exist and if so returns a token |


### Get

| Route Name | URL | HTTP Verb | Description |
|-----|----|----|--|
| Root | / | GET | api started |
| Show | /user/:id | GET | Retrieve all the sell and buy of a user |


###  Update

| Route Name | URL | HTTP Verb | Description |
|-----|----|----|--|
| Update | /buys/ | PATCH | Make smaller the num of shares |

### Delete

| Route Name | URL | HTTP Verb | Description |
|-----|----|----|--|
| Destroy | /user | DELETE | Destroy user and their buys history |
| Destroy | /buys/:id | DELETE | Destroy a buy because it has been sold |
| Destroy | /sells/:id | DELETE | Destroy a sell because user wants |


## Changelog 

Find the full changelog [here](./changelog.md)

## License

[MIT License](https://opensource.org/licenses/mit-license.php)

########### BUGS / OUTSTANDING DEV ###########

- [ ] DB more secure (so token of user1 doesn't allow you to see the investment of user2)
- [ ] Improved error handling (add teapod error)
- [ ] Allow users to delete their information
