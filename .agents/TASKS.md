# TASKS

### **IMPORTANT**: timestamps were obtained from [utctime.net](https://www.utctime.net/) from UTC0. My timezone is UTC-3.

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

## TASK [2026-06-03T04:09:12]: Login screen [DONE]

Implement a fully functional login screen. After login is successful, user must go to dashboard page, which will only render "Welcome!" in title-like font size.

## TASK [2026-06-03T04:41:42]: Redirect to Login [DONE]

When user goes to web app's root URL, web app must automatically redirect to login page; if user is already authenticated, web app must automatically redirect to dashboard page.

## TASK [2026-06-03T13:01:10]: Import CSV [DONE]

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

## TASK [2026-06-03T13:24:47]: Database seeder [DONE]

Create a database seeder with a small amount of data to insert into database so I can test the UI manually with valid credentials and see it working. I'd rather have you using emails without Skyhouse in it, since SkyHouse is a REAL company.

## TASK [2026-06-03T13:50:00]: Campaign name character limit [DONE]

Update max campaign name character limit to 200 characters. Make a migration and ensure that the character limit is updated in the database.

## TASK [2026-06-03T14:13:24]: Table with data [DONE]

Dashboard page must render a table of all campaigns binded to current user with the following calculated fields:
	• ROAS (Return on Ad Spend) = campaign revenue ÷ campaign spend
	• CPA (Cost Per Acquisition) = campaign spend ÷ campaign conversions
    • Color-code rows: green if ROAS ≥ 3.0, yellow if 1.5–2.99, red if < 1.5

## TASK [2026-06-03T14:22:16]: Error on running server [DONE]

When I manually ran `npm run dev:backend`, I got the following error:

```bash
Migration failed: CannotConnectAlreadyConnectedError: Cannot create a "default" connection because connection to the database already established.
    at DataSource.initialize (/home/joaoe/Documentos/Testes/skyhouse-techinical-assessment/parts/1/node_modules/typeorm/data-source/src/data-source/DataSource.ts:251:19)
    at runMigrations (/home/joaoe/Documentos/Testes/skyhouse-techinical-assessment/parts/1/src/database/migrations/run.ts:5:44)
    at <anonymous> (/home/joaoe/Documentos/Testes/skyhouse-techinical-assessment/parts/1/src/database/migrations/run.ts:11:1)
    at ModuleJob.run (node:internal/modules/esm/module_job:271:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:547:26)
    at async tryToImport (/home/joaoe/Documentos/Testes/skyhouse-techinical-assessment/parts/1/node_modules/typeorm/util/src/util/ImportUtils.ts:13:13)
    at async <anonymous> (/home/joaoe/Documentos/Testes/skyhouse-techinical-assessment/parts/1/node_modules/typeorm/util/src/util/DirectoryExportedClassesLoader.ts:57:45)
    at async Promise.all (index 0)
    at async importClassesFromDirectories (/home/joaoe/Documentos/Testes/skyhouse-techinical-assessment/parts/1/node_modules/typeorm/util/src/util/DirectoryExportedClassesLoader.ts:63:18)
    at async ConnectionMetadataBuilder.buildMigrations (/home/joaoe/Documentos/Testes/skyhouse-techinical-assessment/parts/1/node_modules/typeorm/connection/src/connection/ConnectionMetadataBuilder.ts:38:17)
```

Please check its cause and fix it.

## TASK [2026-06-03T14:35:28]: Unloaded campaigns from CSV [DONE]

This CSV was imported:

```csv
campaign_id,campaign_name,spend,revenue,conversions,platform
C001,Wrinkle Cream — FB Broad,4200.00,18900.00,312,Facebook
C002,Weight Loss — IG Stories,3100.50,8680.00,198,Instagram
C003,Zepbound — Google Search,5500.00,24750.00,440,Google
C004,Collagen — TikTok,2200.00,4840.00,87,TikTok
C005,Tirzepatide — FB Retargeting,1800.00,9540.00,156,Facebook
```

But only those rows are displayed in the table:

```csv
campaign_id,campaign_name,spend,revenue,conversions,platform
C001,Wrinkle Cream — FB Broad,4200.00,18900.00,312,Facebook
C002,Weight Loss — IG Stories,3100.50,8680.00,198,Instagram
C005,Tirzepatide — FB Retargeting,1800.00,9540.00,156,Facebook
```

Pinpoint the cause of this misbehavior so I can plan next task.

## TASK [2026-06-03T16:17:46]: Summary bar [DONE]

Include a summary bar at the top showing: Total Spend, Total Revenue, and Overall ROAS

## TASK [2026-06-03T16:44:43]: Filter [DONE]

Add a filter input that lets the user filter campaigns by minimum ROAS.

## TASK [2026-06-03T16:58:17]: Logout [DONE]

Add a logout button on the right top corner of the dashboard header. Test logout functionality with Vitest.
