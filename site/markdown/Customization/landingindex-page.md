---
sidebarText: Landing/index page
order: 3
---
# Customizing the landing/index page

This is the page that is shown at the base route (i.e. localhost:3000).

## Changing the JSX

To alter the JSX, you can edit the `components/indexcontent.js` file.

## Changing the CSS

To alter the CSS, you can edit the `styles/index.module.css` file.

## Changes to index.js

The index.js page handles the  rendering, routing, and other functions involved with the operation of the site. Altering it is not recommended, but if necessary, can be done. See the following sections to learn about the necessary changes.

- Altering the development index.js file can be accomplished by changing the `pages/index.js` file. *These changes will only work in development, see below for production.*

- Altering the production index.js file can be accomplished by changing the `internal/buildfiles/index.js` and `internal/buildfiles/[index].js` file.

>! Note: There are slight differences between the two index files in the buildfiles folder. For example, index.js does not have getStaticPaths. These differences are important!