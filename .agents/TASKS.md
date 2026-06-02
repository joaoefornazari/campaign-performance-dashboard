# TASKS

## TASK [2026-06-02T15:00:28]: Bootstrap project

Bootstrap the project. (Read `.agents/INSTRUCTIONS.json` and follow its instruction on the task execution).

## TASK [2026-06-02T17:38:02]: Database structure

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