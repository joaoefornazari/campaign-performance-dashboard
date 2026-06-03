# Campaign Performance Dashboard

This is a Campaign Performance Dashboard with some insights regarding ad campaign data uploaded by the user.

## DISCLAIMER

In `.agents/TASKS.md`, `TASK [2026-06-03T19:32:00]: Soft-deleted registries` remained as To-Do.

## Tech Stack

- Front-end: HTML5, CSS3, vanilla Javascript, Tailwind
- Back-end: Node v24.16.x, Express v5.x
- Database: PostgreSQL v18.x
- Testing: Vitest

## Setup

- [Download it](https://github.com/joaoefornazari/campaign-performance-dashboard/archive/refs/heads/main.zip), extract the ZIP into your computer;
- Install Node v24 in your machine ([Windows guide](https://www.google.com/search?q=install+node+v24+in+my+windows+machine&sca_esv=9be980af34470064&sxsrf=ANbL-n6hZl_e1_rt9__lnksOKIvxXFiE7Q%3A1780506242983&ei=gl4garDVO7Pb1sQPwPGBkAo&biw=1745&bih=952&ved=0ahUKEwiwnojRxuuUAxWzrZUCHcB4AKIQ4dUDCBA&uact=5&oq=install+node+v24+in+my+windows+machine&gs_lp=Egxnd3Mtd2l6LXNlcnAiJmluc3RhbGwgbm9kZSB2MjQgaW4gbXkgd2luZG93cyBtYWNoaW5lMgUQABjvBTIFEAAY7wUyBRAAGO8FMgUQABjvBTIFEAAY7wVIxixQ7w1Y1iZwAXgBkAEAmAGmAaAB0wSqAQMwLjS4AQPIAQD4AQGYAgWgAowFwgIKEAAYRxjWBBiwA8ICCBAhGKABGMMEmAMAiAYBkAYIkgcDMS40oAf8DLIHAzAuNLgH9wTCBwcwLjEuMy4xyAckgAgB&sclient=gws-wiz-serp) | [Linux guide](https://www.google.com/search?q=install+node+v24+in+my+linux+machine&sca_esv=9be980af34470064&biw=1745&bih=952&sxsrf=ANbL-n5zLJmp56OC4O5PkKrwSnUd77-amA%3A1780506253310&ei=jV4garDKEvrL1sQP68aJYQ&ved=0ahUKEwjwxP7VxuuUAxX6pZUCHWtjIgwQ4dUDCBA&uact=5&oq=install+node+v24+in+my+linux+machine&gs_lp=Egxnd3Mtd2l6LXNlcnAiJGluc3RhbGwgbm9kZSB2MjQgaW4gbXkgbGludXggbWFjaGluZTIIECEYoAEYwwRI2BVQtghY5Q1wAngAkAEAmAGWAaAB2wWqAQMwLja4AQPIAQD4AQGYAgagAqkEwgIKEAAYRxjWBBiwA8ICDhAAGOQCGNYEGLAD2AEBwgIXEC4Y3AYYuAYY2gYY2AIYyAMYsAPYAQHCAgoQIRgKGKABGMMEmAMAiAYBkAYNugYGCAEQARgJkgcDMi40oAf1HbIHAzAuNLgHlgTCBwcwLjIuMy4xyAcbgAgB&sclient=gws-wiz-serp) | [MacOS guide](https://www.google.com/search?q=install+node+v24+in+my+macos+machine&sca_esv=9be980af34470064&biw=1745&bih=952&sxsrf=ANbL-n4mRBK0mnVlGMgpMr6UWgkTyvNIcw%3A1780506419429&ei=M18gavLwGazf5OUP7PP_kA8&ved=0ahUKEwiy1pmlx-uUAxWsL7kGHez5H_IQ4dUDCBA&uact=5&oq=install+node+v24+in+my+macos+machine&gs_lp=Egxnd3Mtd2l6LXNlcnAiJGluc3RhbGwgbm9kZSB2MjQgaW4gbXkgbWFjb3MgbWFjaGluZTIIECEYoAEYwwRIrxdQ_xFYsBVwAngBkAEAmAG3AaAB2AWqAQMwLjW4AQPIAQD4AQGYAgOgApcBwgIKEAAYRxjWBBiwA8ICFxAuGNwGGLgGGNoGGNgCGMgDGLAD2AEBmAMAiAYBkAYNugYGCAEQARgZkgcDMi4xoAf_C7IHAzAuMbgHfsIHBTItMS4yyAcZgAgB&sclient=gws-wiz-serp) );
- Install PostgreSQL v18 in your machine too ([Windows guide](https://www.google.com/search?q=install+postgresql+v18+in+my+windows+machine&sca_esv=9be980af34470064&biw=1745&bih=952&sxsrf=ANbL-n5zLJmp56OC4O5PkKrwSnUd77-amA%3A1780506253310&ei=jV4garDKEvrL1sQP68aJYQ&ved=0ahUKEwjwxP7VxuuUAxX6pZUCHWtjIgwQ4dUDCBA&uact=5&oq=install+postgresql+v18+in+my+windows+machine&gs_lp=Egxnd3Mtd2l6LXNlcnAiLGluc3RhbGwgcG9zdGdyZXNxbCB2MTggaW4gbXkgd2luZG93cyBtYWNoaW5lMgUQABjvBTIFEAAY7wUyBRAAGO8FMgUQABjvBUi9kQFQ22ZYiI0BcAR4AZABAJgBmwGgAaIOqgEEMC4xNLgBA8gBAPgBAZgCDaAC5QnCAgoQABhHGNYEGLADwgIOEAAY5AIY1gQYsAPYAQHCAhcQLhjcBhi4BhjaBhjYAhjIAxiwA9gBAcICCBAhGKABGMMEwgIKECEYChigARjDBJgDAIgGAZAGDboGBggBEAEYCZIHAzQuOaAH-EGyBwMwLjm4B8QJwgcHMC40LjYuM8gHQYAIAQ&sclient=gws-wiz-serp) | [Linux guide](https://www.google.com/search?q=install+postgresql+v18+in+my+linux+machine&sca_esv=9be980af34470064&biw=1745&bih=952&sxsrf=ANbL-n4bHYOChgBtl0ix5HbV8sAxNKf2LA%3A1780506273700&ei=oV4gaqu7KsjM1sQPjeK8uQg&ved=0ahUKEwjrj9vfxuuUAxVIppUCHQ0xL4cQ4dUDCBA&uact=5&oq=install+postgresql+v18+in+my+linux+machine&gs_lp=Egxnd3Mtd2l6LXNlcnAiKmluc3RhbGwgcG9zdGdyZXNxbCB2MTggaW4gbXkgbGludXggbWFjaGluZTIIECEYoAEYwwQyCBAhGKABGMMESIsNUOUFWNEKcAJ4AZABAJgBuwGgAYgFqgEDMC41uAEDyAEA-AEBmAIGoALJBMICChAAGEcY1gQYsAPCAgoQIRgKGKABGMMEmAMAiAYBkAYIkgcFMi4zLjGgB4sXsgcFMC4zLjG4B7oEwgcHMC4xLjQuMcgHIYAIAQ&sclient=gws-wiz-serp) | [MacOS guide](https://www.google.com/search?q=install+postgresql+v18+in+my+macos+machine&sca_esv=9be980af34470064&biw=1745&bih=952&sxsrf=ANbL-n6yGPfATRmenQLT_QyvGAufyb7I5w%3A1780506331796&ei=214gauKhMLbm1sQPttTFmQU&ved=0ahUKEwii-7T7xuuUAxU2s5UCHTZqMVMQ4dUDCBA&uact=5&oq=install+postgresql+v18+in+my+macos+machine&gs_lp=Egxnd3Mtd2l6LXNlcnAiKmluc3RhbGwgcG9zdGdyZXNxbCB2MTggaW4gbXkgbWFjb3MgbWFjaGluZTIFEAAY7wUyBRAAGO8FMggQABiABBiiBEiyzwNQ5soDWPLNA3AIeAGQAQCYAaIBoAHyBKoBAzAuNbgBA8gBAPgBAZgCCqACtALCAgoQABhHGNYEGLADwgIKECEYChigARjDBJgDAIgGAZAGCJIHAzguMqAH7Q2yBwMwLjK4B_IBwgcHMC4xLjguMcgHPIAIAQ&sclient=gws-wiz-serp));
- Open Terminal or Command window inside project's root directory;
- Run this command to install dependencies:

```bash
npm install
```

- After that, run this command to build the UI:

```bash
npm run build
```

- Start PostgreSQL on your machine ([Windows guide](https://www.google.com/search?q=start+postgresql+in+my+windows+machine&oq=start+postgresql+in+my+windows+machine&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDYyNjNqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8) | [Linux guide](https://www.google.com/search?q=start+postgresql+in+my+linux+machine&sca_esv=9be980af34470064&sxsrf=ANbL-n4BUiJYGf-CXdITowVL3mHjS4n_tQ%3A1780507296308&ei=oGIgaoLBEveM5OUPxtCx4Ak&biw=1745&bih=952&ved=0ahUKEwiCkarHyuuUAxV3BrkGHUZoDJwQ4dUDCBA&uact=5&oq=start+postgresql+in+my+linux+machine&gs_lp=Egxnd3Mtd2l6LXNlcnAiJHN0YXJ0IHBvc3RncmVzcWwgaW4gbXkgbGludXggbWFjaGluZTIIECEYoAEYwwRItxxQvw5Y3xZwBngBkAEAmAGZAaAB5wSqAQMwLjW4AQPIAQD4AQGYAgugAsUFwgIKEAAYRxjWBBiwA8ICChAhGAoYoAEYwwSYAwCIBgGQBgiSBwM2LjWgB6kRsgcDMC41uAeXBcIHBzAuMi44LjHIBzmACAE&sclient=gws-wiz-serp) | [MacOS guide](https://www.google.com/search?q=start+postgresql+in+my+macos+machine&sca_esv=9be980af34470064&biw=1745&bih=952&sxsrf=ANbL-n44oqo1SRZtVLH7RjdIG7iYPUVsQw%3A1780507307772&ei=q2IgatfuLsqs5OUP8f3UmQc&ved=0ahUKEwiX8OXMyuuUAxVKFrkGHfE-NXMQ4dUDCBA&uact=5&oq=start+postgresql+in+my+macos+machine&gs_lp=Egxnd3Mtd2l6LXNlcnAiJHN0YXJ0IHBvc3RncmVzcWwgaW4gbXkgbWFjb3MgbWFjaGluZTIFEAAY7wUyBRAAGO8FMgUQABjvBTIFEAAY7wVIoxFQ8AlYrQ1wA3gBkAEAmAGaAaABigWqAQMwLjW4AQPIAQD4AQGYAgSgAo4BwgIKEAAYRxjWBBiwA5gDAIgGAZAGCJIHAzMuMaAHqg2yBwMwLjG4B3vCBwUwLjEuM8gHE4AIAQ&sclient=gws-wiz-serp))

- Run this command to initialize project's data:

```bash
npm run migrate
npm run seed
```

- Then, run this last command to put web app live locally:

```bash
npm run dev:backend
```

- Access `http://localhost:3000` to view the web app! [Link](http://localhost:3000)

## Usage

### Test credentials

- Admin user:
```json
{
    "email": "admin@testmail.com",
    "password": "password"
}
```

- Standard user:
```json
{
    "email": "joao@testmail.com",
    "password": "password"
}
```

## Features

- **Login / Logout**: Authenticate as admin or standard user; auto-redirect to dashboard when logged in, to login when logged out.
- **CSV Import**: Upload a CSV with campaign data. Validates format (8 required columns) and shows a modal on errors.
- **Dashboard Table**: Displays campaigns with **ROAS**, **CPA**, color-coded rows (green ≥ 3.0, yellow 1.5–2.99, red < 1.5), and **Stock Variation** (via [AlphaVantage API](https://www.alphavantage.co/)).
- **Summary Bar**: Total Spend, Total Revenue, and Overall ROAS at the top.
- **ROAS Filter**: Filter campaigns by minimum ROAS value.

### Import CSV with data

Valid CSV format (8 columns):

```csv
campaign_id,campaign_name,spend,revenue,conversions,platform,company,start_date
C001,Wrinkle Cream FB,4200.00,18900.00,312,Facebook,BeautyInc,2025-06-01
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev:backend` | Start the Express server |
| `npm run dev:frontend` | Watch and rebuild frontend assets |
| `npm run build` | Build frontend assets for production |
| `npm test` | Run the test suite (Vitest) |
| `npm run migrate` | Run database migrations |
| `npm run seed` | Seed the database with sample data |
