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
│   │   │   ├── sign-up
│   │   │   │   └── [[...sign-up]]
│   │   │   │   │		└── page.tsx
│   │   │   ├── sign-in
│   │   │   │   └── [[...sign-in]]
│   │   │   │   │		└── page.tsx
│   │   └── layout.tsx
```

> **Note**: here we've created both the login and register routes using organizational wrappers called [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups) .

> ## Route Groups
>
> However, you can mark a folder as a **[Route Group](https://nextjs.org/docs/app/building-your-application/routing/route-groups)** to prevent the folder from being included in the route's URL path.
>
> This allows you to organize your route segments and project files into logical groups without affecting the URL path structure.
>
> ### Convention
>
> A route group can be created by wrapping a folder's name in parenthesis: `(folderName)`

> ## Catch All Route
>
> We're also using a **[catch-all](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#catch-all-segments)** route segment for each route allowing us to expose those routes to clerk so that i can use those api routes to handle our authentication logic.
>
>
> ### Convention
>
> Dynamic Segments can be extended to **catch-all** subsequent segments by adding an ellipsis inside the brackets `[...folderName]`.



## Auth

[Clerk](https://clerk.com/) | [Dashboard](https://dashboard.clerk.com/apps/app_2bBprDEnV6XN5uIfdSexytvCdXE/instances/ins_2bBprHV32gHNYspEWDPCcFnJVgd)

```bash
#.env

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_••••••••••••••••••••••••••••••••••••••••••
CLERK_SECRET_KEY=sk_test_••••••••••••••••••••••••••••••••••••••••••
```

> **NOTE:** because we plan to use prisma we're planning ahead and using a `.env` file instead of a `.env.local` file.

```bash
yarn add @clerk/nextjs
```

```jsx
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
			{/*...*/}
    </ClerkProvider>
  );
}
```

```jsx
// middleware.ts

import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

```jsx
// SignIn.tsx

import { SignIn } from "@clerk/nextjs"

const Page = () => {
  return (
    <SignIn/>
  )
}

export default Page
```

```jsx
// SignUp.tsx

import { SignUp } from "@clerk/nextjs"

const Page = () => {
  return (
    <SignUp/>
  )
}

export default Page
```

```bash
# .env

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

```jsx
// app/(auth)/layout.tsx

import React from 'react'

 const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="h-full flex items-center justify-center">{children}</div>
  )
}

export default AuthLayout;
```

```jsx
// app/(main)/page.tsx

import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl="/"/>
    </div>
  );
}

```

