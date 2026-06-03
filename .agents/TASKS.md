# TASKS

Note: timestamps were obtained from [utctime.net](https://www.utctime.net/) from UTC0. My timezone is UTC-3.

## TASK [2026-06-02T15:00:28]: Bootstrap project [DONE]

Bootstrap the project. (Read `.agents/INSTRUCTIONS.json` and follow its instruction on the task execution).

## TASK [2026-06-02T17:38:02]: Database structure [DONE]

Add to database the following tables:

```json
[
	{
		"name": "campaigns",
		"attributes": [
			{
				"name": "id",
				"type": "integer",
				"settings": {
					"primary-key": true,
					"autoincrement": true
				}
			},
			{
				"name": "name",
				"type": "string",
				"settings": {
					"character-limit": {
						"min": "10",
						"max": "20"
					}
				}
			},
			{
				"name": "spend",
				"type": "float",
				"settings": {
					"limit": {
						"min": "0",
						"max": "POSTGRES_FLOAT_MAX",
					}
				}
			},
			{
				"name": "revenue",
				"type": "float",
				"settings": {
					"limit": {
						"min": "0",
						"max": "POSTGRES_FLOAT_MAX",
					}
				}
			},
			{
				"name": "conversions",
				"type": "integer",
				"settings": {
					"limit": {
						"min": "0",
						"max": "POSTGRES_INT_MAX",
					}
				}
			},
			{
				"name": "platform_id",
				"type": "integer",
				"settings": {
					"foreign-key": true,
					"references": {
						"table": "platform",
						"primary-key": "id",
						"on-update": "cascade",
						"on-delete": "strict"
					}
				}
			}
		]
	},
	{
		"name": "platforms",
		"attributes": [
			{
				"name": "id",
				"type": "integer",
				"settings": {
					"primary-key": true,
					"autoincrement": true
				}
			},
			{
				"name": "name",
				"type": "string",
				"settings": {
					"character-limit": {
						"min": "2",
						"max": "20"
					}
				}
			}
		]
	}
]
```

## TASK [2026-06-02T18:37:19]: User and campaigns [DONE]

1. Add a foreign key to campaigns:

```json
{
	"name": "user_id",
	"type": "integer",
	"settings": {
		"foreign-key": true,
		"references": {
			"table": "users",
			"primary-key": "id",
			"on-update": "cascade",
			"on-delete": "cascade"
		}
	}
}
```

Add the Laravel relationship methods to Campaigns and Users models so web app can use Laravel's built-in techs to work with relationships.

## TASK [2026-06-02T19:08:03]: Soft-Delete flags [DONE]

Add a "deleted_at" timestamp attribute to **users**, **campaigns** and **platforms** database entities that will signal that the register was deleted.

## TASK [2026-06-02T19:19:25]: Admin and Standard roles [DONE]

Create two user roles: Admin and Standard. Admin can hard-delete registers from database; Standard cannot.

## TASK [2026-06-02T19:31:17]: Users API endpoints [DONE]

Create endpoints that do the following:

### USERS

- POST create user
- GET a single user by id
- GET all users (limit and offset as query params, allow a search query param too)
- PUT update user
- DELETE soft-delete a user
- DELETE hard-delete a user (requires user to be admin)
- PUT restore a soft-deleted user by its ID

### PLATFORMS

- POST create platform
- GET a single platform by id
- GET all platforms
- PUT update platform
- DELETE soft-delete a platform
- DELETE hard-delete a platform (requires user to be admin)
- PUT restore a soft-deleted platform by its ID

### CAMPAIGNS

- POST create campaign
- GET a single campaign by id
- GET all campaign (filter by platform ID or user ID (use query params), limit and offset as query params, allow a search query param too)
- PUT update campaign
- DELETE soft-delete a campaign by its ID
- DELETE hard-delete a campaign by its ID (requires user to be admin)
- PUT restore a soft-deleted campaign by its ID

## TASK [2026-06-03T00:36:19]: Login and logout [DONE]

Create an API user login endpoint and a user logout endpoint. Login must return user's email and name. Logout must have a success message and redirect user to login page (create an empty login page too).

## TASK [2026-06-03T00:54:40]: Login stress test

Add to `./tests/Feature/AuthTest.php` a stress test to validate Laravel rate limit applied on `/api/login` endpoint.
