# rest-one
Simple REST API + Client using Express and Backbone.js


## User API

#### GET /api/user/
Retrieve a list of existing users

#### POST /api/user/
Create a new user or overwrite an existing user

#### GET /api/user/:userID
Get user info

#### PUT /api/user/:userID
Edit (overwrite) an existing user (cannot create a new one)

#### DELETE /api/user/:userID
Delete an existing user

### Issues
How to differentiate POST vs PUT...


## Console Screenshot
![wow!](docs/example.png)


## Limitations
- JSON file based User database (DB is not a area of interest)
- Updating a model is not supported on the frontend, only the API.
- The backend does not manage user id (pk). The index page simply generates a random id for each new user.
