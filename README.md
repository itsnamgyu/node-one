# rest-one

## User API

### GET /api/user/
Retrieve a list of existing users

#### Parameters
None

#### Response
List of user objects

### POST /api/user/
Create a new user or overwrite an existing user

#### Parameters
name: string, required
email: string, required

#### Response
User object

### GET /api/user/:userID
Get user info

#### Parameters
None

#### Response
User object

### PUT /api/user/:userID
Edit (overwrite) an existing user (cannot create a new one)

#### Parameters
id: integer, required
name: string, required
email: string, required

#### Response
User object

#### DELETE /api/user/:userID
Delete an existing user

#### Parameters
None

#### Response
User object

## Console Screenshot

![wow!](docs/example.png)


## Limitations
- Updating a model is not supported on the frontend, only the API.
- Doesn't support authentication etc.
