---
sidebarText: Quick start
order: 1
---
# Getting Started

> Note: The package manager this project uses is Yarn. If you do not have it, follow the [installation instructions](https://yarnpkg.com/en/docs/install).

First, clone this repository.

`git clone https://github.com/Jake-Short/nextjs-docs-generator.git`\
\
Then, CD into the directory, install NPM modules, and run the development server.

```
cd nextjs-docs-generator

yarn

yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Developing

To edit the markdown, you can use the button above to switch to markdown mode. You can also 
open the generated .md file in your favorite code editor.\
\
The .md file is located inside the "markdown" folder in the root of the project. It will have a name similar to the one you 
entered (spaces are replaced with "-", and non-alphanumeric characters are removed).

>? Note: The markdown editor is only available on desktop. On mobile, the site will show without editing options.

> Note: When using the markdown editor, your changes will automatically be saved a few seconds after you stop typing.

## Building for production

To generate the Next.js site, run `yarn gen`. This will generate the Next.js site inside of the `site` folder. After generating, to build the final Next.js site for production, run:
```
cd site

yarn

yarn build

# optionally to run the built site locally
yarn start
```
For more information about Next.js sites, you can visit the [Next.js docs](https://nextjs.org/docs/getting-started).

## Important notes

### Deleting a page

To delete a page, simply delete the .md file.

### Changing URL route (renaming a .md file)

Renaming a .md file will change the route that is shown in the URL for the particular .md file.

### Renaming a page

To rename a page (the name shown in the sidebar), edit the metadata attribute `sidebarText` at the top of the .md file.

### Rearranging pages

To rearrange pages under a sidebar header, change the `order` attribute in the .md file. Pages under the same sidebar header will be arranged least-to-greatest based on the `order` attribute.

### Renaming a sidebar header

To rename a sidebar header, simply change the name of the folder that holds the relevant .md files.

### Rearranging sidebar headers

To rearrange sidebar headers, create a file named `_order`, with the contents being solely a number, inside of the relevant folders in the `markdown` folder. Sidebar headers will be arranged least-to-greatest based on the contents of the `_order` files.

### Adding NPM packages

NPM packages can be added and used, and they will carry over into the final build without any additional actions.