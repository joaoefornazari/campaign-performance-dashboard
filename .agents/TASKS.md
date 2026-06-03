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

## TASK [2026-06-03T00:54:40]: Login stress test [DONE]

Add to `./tests/Feature/AuthTest.php` a stress test to validate Laravel rate limit applied on `/api/login` endpoint.

## TASK [2026-06-03T01:25:03] (CRITICAL): Laravel to Express [DONE]

Developer misread the MVP specs. It requires **Node and Express** as backend technologies, *not Laravel*. That means that now we have to **migrate the backend from Laravel to Node** safely.

Tech migration directives:
- Routing: Express
- Middleware: Express native middleware
- ORM: TypeORM
- Testing: Vite
- Storage: local as Laravel does
- /app structures: "translate" them to Node files
- use Typescript
- Resources: Pug
- Providers: "translate" them to Node files

Double-check if there is nothing missing above that the web app requires to keep working as it is before migration, and if there is something missing, give me suggestions and let me choose them for you so you put them in your plan.

**Execute migration step-by-step, and ask me allowance to proceed to next step right after you finish a step.**

## TASK [2026-06-03T02:49:02] (CRITICAL): Check Migration [DONE]

You will check if migration was successful. Node files are inside `./src`. Laravel files are everything outside of it. Compare the tech migration directives and your output will be a list of all functionalities' succesfully migrated. If there are failures, list them with detail and bring a fix plan.

## TASK [2026-06-03T03:27:43]: Test Suite fix [DONE]

Node test suite is getting errors. Run the test suite, make a fix plan and execute the fix plan. Goal: web app functionalities are working as intended.

## TASK [2026-06-03T03:36:20]: Login stress tes (again) [DONE]

Add to `./src/__tests__/auth.test.ts` a stress test to validate rate limit applied on `/api/login` endpoint.

## TASK [2026-06-03T03:45:01]: Failure on UserRoleAuthorization test [DONE]

Output of `npm test`:

```bash
 FAIL  src/__tests__/userRoleAuthorization.test.ts > User Role Authorization (admin gate) > standard user cannot force‑delete a user
Error: expected 201 "Created", got 500 "Internal Server Error"
```

Find error cause and fix it, please.

# TASK [2026-06-03T04:09:12]: Login screen [DONE]

Implement a fully functional login screen. After login is successful, user must go to dashboard page, which will only render "Welcome!" in title-like font size.

# TASK [2026-06-03T04:41:42]: Redirect to Login [DONE]

When user goes to web app's root URL, web app must automatically redirect to login page; if user is already authenticated, web app must automatically redirect to dashboard page.

# TASK []: Import CSV

Add a Import CSV button that will get a CSV file input by user and will load its data into the database binded to the current user.

Example of valid CSV:

```csv
campaign_id,campaign_name,spend,revenue,conversions,platform
C001,Wrinkle Cream — FB Broad,4200.00,18900.00,312,Facebook
C002,Weight Loss — IG Stories,3100.50,8680.00,198,Instagram
C003,Zepbound — Google Search,5500.00,24750.00,440,Google
C004,Collagen — TikTok,2200.00,4840.00,87,TikTok
C005,Tirzepatide — FB Retargeting,1800.00,9540.00,156,Facebook
```

If CSV doesn't follow the above structure, it must throw a modal warning user that the CSV is invalid and cancel importing data.

If CSV is valid and data is succesfully imported, a alert() must be thrown with a confirmation message.

# TASK []: Table with data

Dashboard page must render a table of all campaigns binded to current user with the following calculated fields:
	• ROAS (Return on Ad Spend) = campaign revenue ÷ campaign spend
	• CPA (Cost Per Acquisition) = campaign spend ÷ campaign conversions
    • Color-code rows: green if ROAS ≥ 3.0, yellow if 1.5–2.99, red if < 1.5
