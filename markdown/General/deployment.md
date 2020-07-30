---
sidebarText: Deployment
order: 2
---
# Deployment

There are multiple ways to deploy this site. Next.js is built by [Vercel](https://vercel.com), so the hosting integration with them is nice. Read below to learn about the options for deployment.

## [Vercel](https://vercel.com)

To deploy to Vercel, run the `yarn gen` command, which will output a `site` folder. Upload the contents of that folder to a GitHub, GitLab, or Bitbucket repository, and connect that repository to Vercel.\
\
You're done! Vercel should automatically build and deploy your site after you connect the repository.

### Alternative Vercel Deployment

If you have uploaded the whole project to GitHub (not just the contents of the `site` folder), then you can follow these instructions to deploy to Vercel.\
\
To start deployment, from the root of your site, run `yarn gen`. This will generate a `site` folder that contains the generated Next.js site. Next, upload the whole project, with the generated `site` folder, to GitHub, GitLab, or Bitbucket.\
\
Next, go to [Vercel](https://vercel.com), and connect your GitHub repository.\
\
In the created Vercel project, go inside of the project settings, click the `General` section, and look for the `Root Directory`. Change the value to `site`.\
\
Your Vercel project settings should look like this:\
\
<img src="https://imgur.com/rb1E2Yp.png" width="90%;" style="box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.07);" />