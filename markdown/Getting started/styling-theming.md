---
sidebarText: Styling/theming
order: 2
---
# Styling/theming

For styling and theming, you have a few options.

## Changing CSS

You can alter the styling by changing any of the CSS files inside of the `styles` folder. Basic changes,
such as accent color and base font size, can be altered by changing the CSS variables at the top of the `variables.css` file.

## Changing code theme

You can change the code highlighting theme by changing the imported theme inside the `components/codeblock.js` file.\
\
Change the `xcode` portion of this line to one of the other available themes:
```
import codeTheme from 'react-syntax-highlighter/dist/cjs/styles/hljs/xcode';
```
You can view a preview of possible themes [here](https://highlightjs.org/static/demo/).

## Styling and changing logo

You can swap the `public/logo.svg` file with another SVG file. Alternatively, you can use a different format image, and change the `logo` path in the `components/sidebar.js` file.\
\
In the `components/sidebar.js` file, there are also a few other options near the top of the file (such as disabling or centering the logo).