---
sidebarText: Update
order: 3
---
# Update

## Checking version

To check the version you are on, you can run the command `yarn ver`. This will output something such as `1.0.0`. To view the latest version of the project, view the releases on the [GitHub repository](https://github.com/Jake-Short/nextjs-docs-generator/releases).

## Updating

You are able to update your project to include new changes in the GitHub repository. To get started, run `yarn update`. This will first download the latest GitHub repository version to a temporary directory.\
\
After running that command, you will be asked to select which of the following folders you want to update:
`internal, styles, pages, components`.\
\
After choosing the folders to update, and confirming your actions, the new folders (as selected above) will overwrite the old ones.

>! Be careful which folders you choose to update! All files will be overwritten with the new ones.