16:49:33.427 Running build in Washington, D.C., USA (East) – iad1
16:49:33.428 Build machine configuration: 2 cores, 8 GB
16:49:33.543 Cloning github.com/shairahamancsc/vcflow (Branch: main, Commit: c718f31)
16:49:33.544 Previous build caches not available.
16:49:33.722 Cloning completed: 179.000ms
16:49:34.098 Running "vercel build"
16:49:34.483 Vercel CLI 48.12.0
16:49:34.807 Installing dependencies...
16:49:38.055 npm warn deprecated rimraf@2.7.1: Rimraf versions prior to v4 are no longer supported
16:49:38.891 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
16:49:41.731 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
16:49:56.855 
16:49:56.856 added 927 packages in 22s
16:49:56.857 
16:49:56.858 109 packages are looking for funding
16:49:56.860   run `npm fund` for details
16:49:56.933 Detected Next.js version: 15.3.3
16:49:56.941 Running "npm run build"
16:49:57.476 
16:49:57.476 > nextn@0.1.0 build
16:49:57.476 > NODE_ENV=production next build
16:49:57.476 
16:49:58.064 Attention: Next.js now collects completely anonymous telemetry regarding usage.
16:49:58.065 This information is used to shape Next.js' roadmap and prioritize features.
16:49:58.065 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
16:49:58.065 https://nextjs.org/telemetry
16:49:58.066 
16:49:58.130    ▲ Next.js 15.3.3
16:49:58.130 
16:49:58.143    Creating an optimized production build ...
16:50:17.235  ✓ Compiled successfully in 15.0s
16:50:17.245    Skipping validation of types
16:50:17.247    Skipping linting
16:50:17.491    Collecting page data ...
16:50:20.631    Generating static pages (0/12) ...
16:50:21.685 Error occurred prerendering page "/admin/dashboard". Read more: https://nextjs.org/docs/messages/prerender-error
16:50:21.685 Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.
16:50:21.686   {$$typeof: ..., render: function, displayName: ...}
16:50:21.687                           ^^^^^^^^
16:50:21.687     at e$ (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:17:23573)
16:50:21.687     at Object.toJSON (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:17:14854)
16:50:21.687     at stringify (<anonymous>)
16:50:21.687     at eF (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:17:26079)
16:50:21.687     at eq (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:17:26391)
16:50:21.687     at ez (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:17:26887)
16:50:21.688     at AsyncLocalStorage.run (node:internal/async_local_storage/async_context_frame:63:14)
16:50:21.688     at /vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:17:27678
16:50:21.688     at node:internal/process/task_queues:149:7
16:50:21.688     at AsyncResource.runInAsyncScope (node:async_hooks:214:14)
16:50:21.688 Export encountered an error on /admin/dashboard/page: /admin/dashboard, exiting the build.
16:50:21.691  ⨯ Next.js build worker exited with code: 1 and signal: null
16:50:21.730 Error: Command "npm run build" exited with 1# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
# vcflow
