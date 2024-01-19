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

![image-20240119164547448](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/uPic/2024/image-20240119164547448.png)



## Themeing

**NOTE:** All of these steps are provided in the [shadcn/ui](shadcn/ui) docs

```bash
yarn add next-themes
```

```jsx
// components/providers/theme-provider.tsx

"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

```jsx
// app/layout.tsx

// app/layout.tsx
import { ThemeProvider } from "@/components/providers/theme-provider"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey="disc-theme"
        // disableTransitionOnChange
      >
        {/*...*/}
      </ThemeProvider>
    </body>
  );
}
```

> With this in place our site should reflect that we've chosen a dark theme with our custom dark background color



```jsx
// components/mode-toggle.tsx

"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

> **Notice:** we're relying on a `Dropdown` component from shadcn/ui, so we'll need to import that into our project as well.
>
> ```bash
> npx shadcn-ui@latest add dropdown-menu
> ```
>
> ```jsx
> // app/(main)/page.tsx
> 
> import { UserButton } from "@clerk/nextjs";
> 
> export default function Home() {
>   return (
>     <div>
>       <ModeToggle/>
>     </div>
>   );
> }
> ```



