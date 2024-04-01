# CabApp Engine

The CabApp Engine is the server-side component of the CabApp application. It is built using ExpressJS and Typescript.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [GraphQL Schema](#graphql-schema)
- [Contributing](#contributing)
- [License](#license)

## Overview

The CabApp Engine serves as the backend for the apartment renting website. It handles requests from the client, interacts with the database, and implements the business logic of the application.

## Project Structure

The project structure of the CabApp Engine is as follows:

- **src**: Contains the source code of the NestJS application.
  - **config**: Contains the application configuration (eg. PORT, NODE_ENV, MongoDB URI etc).
  - **routes**: Contains routers and controllers for handling client requests.
  - **middlewares**: Contains middlewares for decoding user from token , handling errors etc.
  - **models**: Contains database schemas.
  - **services**: Contains business logic services.
  - **types**: Contains typescript types.
  - **utils**: Contains other app utilities.
  - **start**: Contains app and apollo server initiation logic.

## Getting Started

### Prerequisites

Before running the CabApp Engine, make sure you have the following installed:

- Node.js
- npm or Yarn
- MongoDB 

### Installation

1. Clone the repository:

`git clone https://github.com/jewtechx/cab_app_engine.git`

2. Navigate to the `engine` directory:

`cd CabApp_engine/engine`

3. Install dependencies:

`yarn install`

2. Add the following environment variables to the .env file:

```bash
NODE_ENV=development
PORT=8000
DEV_MONGO_URI=
TEST_MONGO_URI=
PROD_MONGO_URI=
TOKEN_EXPIRY=
LOGGER_LEVEL=
DEV_MAIL_USER=
DEV_MAIL_PASS=
DEV_MAIL_HOST=
DEV_MAIL_PORT=
DEV_MAIL_SECURE=

MAIL_USER=
MAIL_PASS=
MAIL_HOST=
MAIL_PORT=
MAIL_SECURE=

PAYSTACK_TEST_SECRET_KEY=
```

## Usage

To start the CabApp Engine, run the following command:

npm run dev

The engine will start running on the specified port, and you can access the GraphQL endpoint in your browser at `http://localhost:8080`.

## Routes

**Base Url**
 ```bash 
https://cab-app-engine.onrender.com/
```
**Authentication - SMS OTP**
 ```bash 
/auth/register
```
This route registers a new user

_request_
 ```bash 
{
  "phoneNumber":"233265865717"
}
```
_response_
 ```bash 
{
  "user": {
    "phoneNumber": "233265865717",
    "verified": false,
    "settings": {
      "language": "EN",
      "theme": "LIGHT",
      "notificationEnabled": true,
      "soundEnabled": true,
      "autoSaveInterval": 10,
      "profileVisibility": "PUBLIC",
      "contactInfoVisibility": "PUBLIC",
      "locationSharingEnabled": true,
      "activityTrackingEnabled": true,
      "dataSharingEnabled": true,
      "dataRetentionPeriod": 365,
      "twoFactorAuthEnabled": false,
      "dataEncryptionEnabled": false
    },
    "_id": "6602df812ad5f9d765f57219",
    "verificationCode": "6019",
    "rating": [],
    "createdAt": "2024-03-26T14:45:21.359Z",
    "updatedAt": "2024-03-26T14:45:21.359Z",
    "__v": 0
  }
}
```

 ```bash 
/auth/verify
```
This route verifies the new user

_request_
 ```bash 
{
  "id":"6602d308ada621866a6c9ff3",
  "verificationCode":"7648"
}
```

return true or false


 ```bash 
/auth/login
```
This route allows a user to login

_request_
 ```bash 
{
  "phoneNumber":"233265865717",
  "password":"password"
}
```

_response_
```bash
{
  "user": {
    "phoneNumber": "233265865717",
    "verified": false,
    "settings": {
      "language": "EN",
      "theme": "LIGHT",
      "notificationEnabled": true,
      "soundEnabled": true,
      "autoSaveInterval": 10,
      "profileVisibility": "PUBLIC",
      "contactInfoVisibility": "PUBLIC",
      "locationSharingEnabled": true,
      "activityTrackingEnabled": true,
      "dataSharingEnabled": true,
      "dataRetentionPeriod": 365,
      "twoFactorAuthEnabled": false,
      "dataEncryptionEnabled": false
    },
    "_id": "6602df812ad5f9d765f57219",
    "verificationCode": "6019",
    "rating": [],
    "createdAt": "2024-03-26T14:45:21.359Z",
    "updatedAt": "2024-03-26T14:45:21.359Z",
    "__v": 0
  }
}
```


## Contributing

Contributions to the CabApp Engine are welcome! Feel free to open issues or submit pull requests to help improve the engine.

## License

This project is licensed under the MIT License

## Author 
Jew Kofi Larbi Danquah