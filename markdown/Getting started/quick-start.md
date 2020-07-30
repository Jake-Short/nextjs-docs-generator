---
sidebarText: Quick start
order: 1
---
# Getting started

> Note: The visual and markdown editors are only available on desktop. On mobile, the site will show without editing options.

To edit the markdown, you can use the button above to switch to markdown mode. You can also 
open the generated .md file in your favorite code editor.\
\
The .md file is located inside the "markdown" folder in the root of the project. It will have a name similar to the one you 
entered (spaces are replaced with "-", and non-alphanumeric characters are removed).

> Note: When using the markdown editor, your changes will automatically be saved a few seconds after you stop typing.

## Important notes

### Changes to index.js

Changes to the `/pages/index.js` file will work during development, but will *not* show up in the final build. If you must alter the final index.js file, you may do so in the files `/internal/buildfiles/index.js` and `/internal/buildfiles/[index].js`.

>! This is discouraged. You can change the content of the default page inside of the components/indexcontent.js file.

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