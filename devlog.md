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



## Prettier

```bash
yarn add -D prettier eslint-config-prettier prettier-plugin-tailwindcss
```

```json
// eslintrc.json

{
  "extends": ["next/core-web-vitals", "prettier"]
}
```

````bash
touch .prettierrc.json
````

```json
// .prettierrc.json

{
  "trailingComma": "es5",
  "semi": true,
  "tabWidth": 2,
  "singleQuote": true,
  "jsxSingleQuote": true,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

```json
// package.json

"scripts": {
  ...
  "format": "prettier --check --ignore-path .gitignore .",
  "format:fix": "prettier --write --ignore-path .gitignore ."
}
```





## Shadcn/ui

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



## DB Setup

### Prisma

```bash
yarn add -D prisma
```

```bash
npx prisma init
```

> this will create a prisma folder with the `schema.prisma` file 
>
> ```js
> // This is your Prisma schema file,
> // learn more about it in the docs: https://pris.ly/d/prisma-schema
> 
> generator client {
>   provider = "prisma-client-js"
> }
> 
> datasource db {
>   provider = "postgresql"
>   url      = env("DATABASE_URL")
> }
> ```
>
> and update your `.env ` file to include a boiler for your `DATABASE_URL`
>
> ```bash
> # .env
> 
> # This was inserted by `prisma init`:
> # Environment variables declared in this file are automatically made available to Prisma.
> # See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema
> 
> # Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
> # See the documentation for all the connection string options: https://pris.ly/d/connection-strings
> 
> DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
> 
> # this is what the connection string from pscale looks like:
> # DATABASE_URL=mysql://••••••••••••••••••••:pscale_pw_•••••••••••••••••••••••••••••••••••••••••••@aws.connect.psdb.cloud/[project-name]]?sslaccept=strict
> ```
>
> **Note:** this connection string needs to be replaced with your own database connection string.
>
> Once you complete the setup you can select prisma as the option to connect to your database via, and this will also provide you with a connection string for the new database.

![image-20240119193642011](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/uPic/2024/image-20240119193642011.png)

> **Note:** credit card is required for the free plan - so use privacy.com
> (*Also see bitwarden for db credentials)



Next we need to configure our `schema.prisma` file to use our mysql flavored planetscale db.

```js
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
}
```

> Now, you can write your Prisma models or modify the existing ones. See Prisma documentation on [Prisma schema](https://www.prisma.io/docs/concepts/components/prisma-schema) to learn more.

We can now add some of the models we'll need:

```js
// prisma/schema.prisma

model Profile {
  id       String @id @default(uuid())
  userId   String @unique
  name     String
  imageUrl String @db.Text
  email    String @db.Text

  servers  Server[]
  members  Member[]
  channels Channel[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Server {
  id         String @id @default(uuid())
  name       String
  imageUrl   String @db.Text
  inviteCode String @db.Text

  profileId String
  profile   Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  members  Member[]
  channels Channel[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([profileId])
}

enum MemberRole {
  ADMIN
  MODERATOR
  GUEST
}

model Member {
  id   String     @id @default(uuid())
  role MemberRole @default(GUEST)

  profileId String
  profile   Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  serverId  String
  server    Server  @relation(fields: [serverId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([profileId])
  @@index([serverId])
}

enum ChannelType {
  TEXT
  AUDIO
  VIDEO
}

model Channel {
  id   String      @id @default(uuid())
  name String
  type ChannelType @default(TEXT)

  profileId String
  profile   Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  serverId  String
  server    Server  @relation(fields: [serverId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([profileId])
  @@index([serverId])
}
```



### Migrating Prisma DB

Finally, once you are ready to push your schema to PlanetScale, run `prisma db push` against your PlanetScale database to update the schema in your database:

```bash
npx prisma generate
```

> ````shell
> ✔ Installed the @prisma/client and prisma packages in your project
> 
> ✔ Generated Prisma Client (v5.8.1) to ./node_modules/@prisma/client in 132ms
> 
> Start using Prisma Client in Node.js (See: https://pris.ly/d/client)
> ```
> import { PrismaClient } from '@prisma/client'
> const prisma = new PrismaClient()
> ```
> or start using Prisma Client at the edge (See: https://pris.ly/d/accelerate)
> ```
> import { PrismaClient } from '@prisma/client/edge'
> const prisma = new PrismaClient()
> ```
> 
> See other ways of importing Prisma Client: http://pris.ly/d/importing-client
> 
> ┌─────────────────────────────────────────────────────────────┐
> │  Deploying your app to serverless or edge functions?        │
> │  Try Prisma Accelerate for connection pooling and caching.  │
> │  https://pris.ly/cli/accelerate                             │
> └─────────────────────────────────────────────────────────────┘
> ````

```bash
npx prisma db push
```

> ```shell
> Environment variables loaded from .env
> Prisma schema loaded from prisma/schema.prisma
> Datasource "db": MySQL database "disc" at "aws.connect.psdb.cloud"
> 
> 🚀  Your database is now in sync with your Prisma schema. Done in 1.17s
> 
> ✔ Generated Prisma Client (v5.8.1) to ./node_modules/@prisma/client in 284ms
> ```



### Prisma Client

```ts
// lib/db.ts

import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

// hack: ensures that hot reload doesn't cause a new client to be created on each reload
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
```





## User Profile

```tsx
// lib/initial-profile.ts

import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";


export const initialProfile = async () => {
  const user = await currentUser();
  if (!user) {
    redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: { userId: user?.id },
  });

  if (!profile) {
    const newProfile = await db.profile.create({
      data: {
        userId: `${user?.id}`,
        name: `${user?.firstName} ${user?.lastName}`,
        imageUrl: `${user?.imageUrl}`,
        email: `${user?.emailAddresses[0].emailAddress}`,
      }
    });

    return newProfile;
  } else {
    return profile;
  }
}
```

```tsx
// app/(setup)/page.tsx

import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function SetupPage() {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          id: profile.id,
        },
      }
    },
  })

  if(server) {
    return redirect(`/servers/${server.id}`);
  }

  return (
    <div>Create a Server</div>
  );
}
```



> This was added later but pertains to the auth portion. This is the utlity function we'll use to authenticate users on our api routes.
>
> ```ts
> // lib/current-profile.ts
> 
> import { auth } from '@clerk/nextjs';
> 
> import { db } from '@/lib/db';
> 
> export const currentProfile = async () => {
>   const { userId } = auth();
> 
>   if (!userId) {
>     return null;
>   }
> 
>   const profile = await db.profile.findUnique({
>     where: { userId },
>   });
>   
>   return profile;
> };
> 
> ```



## Forms

```bash
npx shadcn-ui@latest add form 
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input  
```

> Shadcn/ui uses [react-hook-form](https://react-hook-form.com/) and [zod](zod.dev) for it's form component so these packages are installed when we install the Form component from the package.



At the top of a new file you can import zod and 

```jsx
'use client';


import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  imageUrl: z.string().min(1, {
    message: 'Valid image URL is required',
  }),
});

export const InitialModal = () => {
  
  const [mounted, setIsMounted] = useState(false);

  useEffect(() => {
    // prevents hydration mismatch
    setIsMounted(true);
  }, []);

  const form = useForm({ // form setup
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  });

  const isLoading = form.formState.isSubmitting; // 

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  if (!mounted) {
    // used to prevent hydration mismatch
    return null;
  }
  
  
	return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
      <div className='space-y08 px-6'>
        <div className='flex items-center justify-center text-center'>
          <FormField
            control={form.control}
            name='imageUrl'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FileUpload
                    endpoint='serverImage'
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          ></FormField>
        </div>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className='text-xs font-bold uppercase text-zinc-500'
                htmlFor=''
              >
                Server Name
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  className='border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
                  placeholder='Enter a server name'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <DialogFooter className='bg-gray-100 px-6 py-4'>
        <Button type='submit' variant='primary' disabled={false}>
          Create
        </Button>
      </DialogFooter>
    </form>
  </Form>
  )
}
```

> **NOTE:**
>
> We are seeing hydration issues, because our form is rendered in a modal, and modals are notorious for these issues. By relying on the value of mounted, we are ensuring the component cannot render on the server.
>
> We've omitted the dialog component from the render above, just to allow emphasis on the actual logic itself.



## Uploads

[docs](https://docs.uploadthing.com/) | [dashboard](https://uploadthing.com/dashboard/boc9m9nw20/api-keys)

Register, then create a  new uploadthing app, and get an API credentials from [uploadthing](https://uploadthing.com/).

```bash
UPLOADTHING_SECRET=sk_live_•••••••••••••••••••••••••••••••••••••••••••
UPLOADTHING_APP_ID=••••••••
```

```bash
yarn add uploadthing @uploadthing/react
```

```ts
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@clerk/nextjs/';

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  messageFile: f(['image', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
```

> See the [default FileRoute](https://docs.uploadthing.com/getting-started/appdir) from the docs for this file, for a better understanding

```ts
// app/api/uploadthing/route.ts

import { createNextRouteHandler } from "uploadthing/next";
 
import { ourFileRouter } from "./core";
 
// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});
```

> File path here doesn't matter, you can serve this from any route. We recommend serving it from `/api/uploadthing`.



> **NOTE: ** use the snippet below to add default tailwind styles for the upload components.
>
> ```ts
> // tailwind.config.ts
> 
> import { withUt } from "uploadthing/tw";
>  
> export default withUt({
>   // Your existing Tailwind config
>   content: ["./src/**/*.{ts,tsx,mdx}"],
>   ...
> });
> ```

**Expose Uploadthing components**:

```ts
// lib/uploadthing.ts

import { generateComponents } from '@uploadthing/react';

import type { OurFileRouter } from '@/app/api/uploadthing/core';


export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();

```

**Extend Auth Middleware**

```ts
// middleware.ts

export default authMiddleware({
  publicRoutes: ["/api/uploadthing"]
});
```

> allow the api to be publically accessible.



Now we can finallly implement our Upload component:

```tsx
'use-client';
import { X } from 'lucide-react';
import Image from 'next/image';
import { UploadDropzone } from '@/lib/uploadthing';
import '@uploadthing/react/styles.css';
import { Button } from './ui/button';

interface FileUploadProps {
  endpoint: 'messageFile' | 'serverImage';
  value: string;
  onChange: (url: string) => void;
}

export function FileUpload({ endpoint, value, onChange }: FileUploadProps) {
  const fileType = value?.split('.').pop();
  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-20 w-20'>
        <Image fill src={value} alt='Upload' className='rounded-full' />
        <Button
          className='absolute right-0 top-0 rounded-full bg-rose-400 p-1 text-white shadow-sm'
          onClick={() => onChange('')}
        >
          <X className='h-4 w-4' />
        </Button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={console.log}
    />
  );
}

```



Before we can use our component we still need to whitelist uploadthing in our `next.config.mjs` file so that we can use the next Image component to optimize our images from uploadthing.

```js
// next.config.mjs

export const config = {
  images: {
    domains: ['uploadthing.com', ],
  },
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```



## Server Action: Create Server

```ts
// app/api/servers/route.ts

import { v4 as uuidv4 } from 'uuid';

import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

import { MemberRole, type Profile } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();

    const profile = (await currentProfile()) as Profile | null;
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: 'general', profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVERS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
```

> here we've handled all of the server/db logic that is needed to create a server including populating and connecting all related tables as well as handling authoization via authentication using our custom `currentProfile()` helper.

```ts
// components/modals/initial-modal.tsx

import axios from 'axios';

export const InitialModal = () => {
  //...
  
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post('/api/servers', values);

      form.reset();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  
  //...
}
```

> here we've simply updated the onSubmit handler for our initial-modal form allowing us to communicate with our backend.



```tsx
// app/(setup)/page.tsx

export default async function SetupPage() {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          id: profile.id,
        },
      },
    },
  });

  if (server) {
    // this is where we're redirecting users.
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
}
```

> Currently when a user successfully creates a server, we're supposed to be routing them directly to that newly created server using that server's id. We will have to introduce some logic and UI to accomodate this behavior.



## Server Layout

First we'll need a page to render when a specific server is being accessed.

```tsx
// app/(main)/(routes)/servers/[serverId]/page.tsx

export default function ServerPage() {
  return (
  	<div>Server ID page  </div>
  )
}
```



Add a custom layout for this route.

```jsx
// app/(main)/(routes)/layout.tsx

import { NavigationSidebar } from "@/components/navigation/navigation-sidebar"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-full'>
      <div className='fixed inset-y-0 z-30 hidden h-full w-[72px] flex-col md:flex'>
        <NavigationSidebar/>
      </div>
      <main className='h-full md:pl-[72px]'>{children}</main>
    </div>
  );
}

```



## Server Component: Sidebar

Next let's add the Sidebar component (which will be a server component) we're attempting to render above:

```tsx
// components/navigation/navigation-sidebar.tsx

import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

import { currentProfile } from '@/lib/current-profile';

import { NavigationAction } from './navigation-action';
import { NavigationItem } from './navigation-item';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { ModeToggle } from '../mode-toggle';
import { UserButton } from '@clerk/nextjs';

export async function NavigationSidebar() {
  const profile = await currentProfile();
  if (!profile) return redirect('/');

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className='py-e flex h-full w-full flex-col items-center space-y-4 text-primary dark:bg-[#1E1F22]'>
      <NavigationAction />
      <Separator className='mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700' />
      <ScrollArea className='w-full flex-1'>
        {servers.map((server) => (
          <div key={server.id} className='mb-4'>
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className='mt-auto flex flex-col items-center gap-y-4 pb-3'>
        <ModeToggle />
        <UserButton
          afterSignOutUrl='/'
          appearance={{ elements: { avatarbox: 'h-[48px] w-[48px]' } }}
        />
      </div>
    </div>
  );
}
```

> the `async` keyword in the component definition makes this explictly a server component. This means we can safely do any data-fetching or authenicating in this file.
>
> In the above code, we've added `NavigationAction` and `NavigationItem` components which we'll need to define next.



**Dependencies Added**

> - [x] `npx shadcn-ui@latest add tooltip`
> - [x] `npx shadcn-ui@latest add separator`
> - [x] `npx shadcn-ui@latest add scroll-area`



## Client Component: Tooltip

```tsx
// components/navigation/navigation-action.tsx

'use-client';

import { Plus } from 'lucide-react';

import { ActionTooltip } from '../action-tooltip';

export function NavigationAction() {
  return (
    <div className=''>
      <ActionTooltip side='right' align='center' label='Add a server'>
        <button className='group flex items-center'>
          <div className='mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700'>
            <Plus
              className='text-emerald-500 transition group-hover:text-white'
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
}
```



```tsx
// components/ui/action-tooltip.tsx

'use-client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface ActionTooltipProps {
  label: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export function ActionTooltip({
  label,
  children,
  side,
  align,
}: ActionTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className='text-sm font-semibold capitalize'>
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```



```tsx
// components/navigation/navigation-item.tsx

'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { ActionTooltip } from '../ui/action-tooltip';

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export function NavigationItem({ id, imageUrl, name }: NavigationItemProps) {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip side='right' align='center' label={name}>
      <button onClick={onClick} className='group relative flex items-center'>
        <div
          className={cn(
            'transition=all absolute left-0 w-[4px] rounded-r-full bg-primary',
            params?.serverId !== id && 'group-hover:h-[20px]',
            params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
          )}
        />
        <div
          className={cn(
            'group relative mx-3 flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]',
            params?.serverId === id &&
              'rounded-[16px] bg-primary/10 text-primary'
          )}
        >
          <Image fill src={imageUrl} alt='Channel' />
        </div>
      </button>
    </ActionTooltip>
  );
}
```





## Add Server Action

**Dependencies**

> ```bash
> yarn add zustand
> ```



Create a modal store hook that can be extended in the future for use with all of the modals in the project. 

```ts
// hooks/use-modal-store.ts

import { create } from 'zustand';

export type ModalType = 'createServer';

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: 'createServer',
  isOpen: false,
  onOpen: (type) => set({ type: type, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false }),
}));
```



Next we'll need to create a provider that we can use to consume this store and expose its api for it's children.

```tsx
// components/providers/modal-provider.tsx

'use-client';

import { useEffect, useState } from 'react';

import { CreateServerModal } from '@/components/modals/create-server-modal';

export function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
    </>
  );
}

```



Now we'll need to wrap the root layout with the provider, so that it can be accessed by all children of the provider.

```tsx
// app/layout.tsx

import { ModalProvider } from '@/components/providers/modal-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ...
    
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem={false}
      storageKey='disc-theme'
      // disableTransitionOnChange
    >
      <ModalProvider />
      {children}
    </ThemeProvider>
    
    // ...
  )
}
```



Next we'll need a UI for Creating a new server, which will have very similar logic to our `InitialModal` component.

````tsx
// components/modals/create-server-modal.tsx

'use client';

import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FileUpload } from '../file-upload';
import { UserButton } from '@clerk/nextjs';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required',
  }),
  imageUrl: z.string().min(1, {
    message: 'Valid Server image is required',
  }),
});

export const CreateServerModal = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post('/api/servers', values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogContent className='overflow-hidden bg-white p-0 text-black'>
        <DialogHeader className='px-6 pt-8'>
          <UserButton />
          <DialogTitle className='text-center text-2xl font-bold'>
            Create new server
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Give your server a personality with a name and image. This can be
            updated later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => onSubmit(data))}
            className='space-y-6'
          >
            <div className='space-y08 px-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint='serverImage'
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className='text-xs font-bold uppercase text-zinc-500'
                      htmlFor=''
                    >
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
                        placeholder='Enter a server name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              {JSON.stringify(form.formState.dirtyFields, null, 2)}
              <Button variant='primary' disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
````



Now we can mount the modal from our existing `NavigationAction` component

```tsx
// components/navigation/navigation-action.tsx

'use-client';

import { Plus } from 'lucide-react';

import { ActionTooltip } from '../action-tooltip';
import { useModal } from '@/hooks/use-modal-store';

export function NavigationAction() {
  const { onOpen } = useModal(); // exposed modal store
  return (
    <div className=''>
      <ActionTooltip side='right' align='center' label='Add a server'>
        <button
          className='group flex items-center'
          onClick={() => onOpen('createServer')} // triggers modal
        >
          <div className='mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700'>
            <Plus
              className='text-emerald-500 transition group-hover:text-white'
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
}
```

