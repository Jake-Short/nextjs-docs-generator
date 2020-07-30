---
sidebarText: Navigation bar
order: 2
---
# Customizing the navigation bar

You can customize the JSX and CSS used to build the navigation bar.

## Changing/adding a logo

You can add a logo to the sidebar in a few steps. First, open the `components/sidebar.js` file. Near the top of the file, you will see this section:

```javascript
// Update path to logo here
const logo = require('../public/logo.svg');

// Set to false to have no logo
const logoIsShown = false;

// Centered logo
const centeredLogo = false;
```

First, set `logoIsShown` to true, then change `../public/logo.svg` to the path of your logo. Alternatively, replace the logo.svg file with your own logo.

## Changing the JSX

To alter the JSX, you can edit the `components/sidebar.js` file.

>! This file contains functions to add a page and add a new section. It is not recommended to change these functions.

## Changing the CSS

To alter the CSS, you can edit the `styles/sidebar.module.css` file.