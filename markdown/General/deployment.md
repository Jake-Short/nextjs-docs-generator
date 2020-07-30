---
sidebarText: Deployment
order: 2
---
# Deployment

There are multiple ways to deploy this site. Next.js is built by [Vercel](https://vercel.com), so the hosting integration with them is nice. Read below to learn about the options for deployment.

## [Vercel](https://vercel.com)

To deploy to Vercel, upload the project to GitHub, GitLab, or Bitbucket. Then, on [Vercel](https://vercel.com), import the repository.\
\
You will see a screen titled `Import Project`. On that page, click the `Build and Output Settings`. You will need to input the following values (you will have to click the override slider):
- Build Command: `yarn gen && cd site && yarn build`

- Output Directory: `site/.next`

The page should look like this:\
\
<img src="https://imgur.com/BT4HLQI.png" width="100%" style="box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.07); max-width: 550px;" />\
\
You're done! Vercel should automatically build and deploy your site.

### Alternative Vercel Deployment

Alternatively, you can run `yarn gen`, which generates a Next.js site in the `site` folder. Upload the contents of that folder to a GitHub, GitLab, or Bitbucket repository.\
\
Next, go to [Vercel](https://vercel.com), and connect your GitHub repository. Vercel should detect that it is a Next.js site and automatically select the correct framework preset.\
\
You're done! Vercel should build and deploy your site.

## [Netlify](https://netlify.com)

To deploy on Netlify, upload the project to GitHub, GitLab, or Bitbucket. Then, on [Netlify](https://netlify.com), import the repository.\
\
You will see a screen titled `Create a new site`, on step 3: `Build options, and deploy!`. On that page, you will need to input the following values:
- Build Command: `yarn gen && cd site && yarn build && yarn export`

- Publish Directory: `site/out`

The page should look like this:\
\
<img src="https://imgur.com/KwUyfnn.png" width="100%" style="box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.07); max-width: 550px;" />\
\
You're done! Netlify should automatically build and deploy your site.