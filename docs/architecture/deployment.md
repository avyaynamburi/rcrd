# PWA and preview deployment (P0-4)

The manifest supports Chrome/Edge installation with 192/512 px original R icons and standalone display. The worker does not intercept fetches, cache clinic data or queue writes. It checks for updates when the window regains focus. A waiting worker produces an explicit Apply update notice; it never reloads the page. Staff finish/save work, apply, then reopen. Unsupported browsers can continue using the site; registration failures display a plain status notice.

Installation help is available from the workspace's Need Help link. The initial shell is data-free. Offline clinical workflows remain part of SHELL-14.

`vercel.json` pins function execution to Mumbai (`bom1`). Git-triggered deployments are disabled to avoid unintended production rollout. A manually dispatched Preview deployment workflow validates the app and deploys only a preview. No production deploy step exists. Hosting configuration has no patient data and must not gain static patient routes, global response caching or Edge runtime data processing.

## Owner setup (not configured yet)

1. In Vercel, create/import the Rcrd Next.js project without deploying production. Verify function region Mumbai. Leave Git auto-deploys disabled as configured in the repository.
2. Create a GitHub Actions environment named `preview`. Add `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` and `VERCEL_TOKEN` as environment secrets from your Vercel account/project. Keep them out of source control and chat.
3. Configure only staging Supabase credentials in Vercel Preview after confirming the Supabase region is Mumbai. Production credentials belong only to the owner's Production environment.
4. Manually dispatch Preview deployment. Open the preview HTTPS URL, test installation/update flow and verify function location in Vercel before any clinic use. The workflow needs account credentials; it has not been executed against hosted Vercel.
5. The owner controls any eventual production deployment. Do not enable automatic production deployment during autonomous builds.

References: https://nextjs.org/docs/app/guides/progressive-web-apps and https://vercel.com/docs/regions
