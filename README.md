# Campaign Performance Dashboard

This is a Campaign Performance Dashboard with some insights regarding ad campaign data uploaded by the user.

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

## Functionalities

### Import CSV with data

Example of valid CSV:

```csv
campaign_id,campaign_name,spend,revenue,conversions,platform
C001,CampaignName,4200.00,18900.00,312,PlatformName
```

### Filters

You can visualize Campaigns by mininum ROAS value.

### Data Insights

Above campaigns list there is a summary of Total Spend, Total Revenue, and Overall ROAS to improve data analysis.
