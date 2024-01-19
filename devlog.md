```bash
➜ npx create-next-app@latest [disc] --typescript --tailwind --eslint
```

```bash
Need to install the following packages:
  create-next-app@14.1.0
Ok to proceed? (y) y
✔ Would you like to use `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to customize the default import alias (@/*)? … No / Yes
✔ What import alias would you like configured? … "@/*"
Creating a new Next.js app in /Users/gshah/neuro/disc.
```



```bash
npx shadcn-ui@latest init
```

```bash
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Stone
✔ Would you like to use CSS variables for colors? … no / yes

✔ Writing components.json...
✔ Initializing project...
✔ Installing dependencies...

Success! Project initialization completed. You may now add components.
```



CSS Percentage based Height Fix:

```css
/* global.css */
html, body, :root {
  height: 100%
}
```



Add Shadcn/Button

```bash
npx shadcn-ui@latest add button
```

> This will add a button component locally to the `app/components/ui/` folder



Add Auth File Structure:

```bash
├── app
│   ├── (auth)
│   │   ├── (routes)
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   └── register
│   │   │       └── page.tsx
│   │   └── layout.tsx
```

> **Note**: here we've created both the login and register routes using organizational wrappers called [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups) as directories allowing us to effectively co-locate our routes with their dependencies logically.
>
> ### Convention
>
> A route group can be created by wrapping a folder's name in parenthesis: `(folderName)`





