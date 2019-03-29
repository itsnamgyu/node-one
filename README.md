# rest-one
Simple REST API + Client using Express and Backbone.js

___
![wow!](docs/example.png)

## API

### GET /api/user/
Get's a list of users

### POST /api/user/
Add a user or edit an existing user

### GET /api/user/:userID
Get user with given `userID`

### PUT /api/user/:userID
Edit an existing user (cannot create a new one)

### DELETE /api/user/:userID
Delete an existing user

### Issues
How to differentiate POST vs PUT...

## Limitations
- JSON file based User database (DB is not a area of interest)
- Updating a model is not supported on the frontend, only the API.
- The backend does not manage user id (pk). The index page simply generates a random id for each new user.
