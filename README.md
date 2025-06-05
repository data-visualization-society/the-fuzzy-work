
# The Fuzzy Work - a visual essay



## Developing

Install dependencies with `pnpm install`, and then start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.


## Deploying

```bash
vercel

vercel --prod
```

When you import a Git repository to Vercel, each commit or pull request (on supported Git providers) automatically triggers a new deployment. See: https://vercel.com/docs/deployments

However, since my email address is masked by a "noreply" address, it doesn't match my account associated to Vercel, so GitHub will always fail to deploy to vercel. That's why we use Vercel CLI instead.


## Speed Insights

Check [Speed Insights](https://vercel.com/docs/concepts/speed-insights) by navigating to Vercel's dashboard, clicking on the 'Speed Insights' tab, and enabling the product.

You will get data once your application is re-deployed and receives visitors.
