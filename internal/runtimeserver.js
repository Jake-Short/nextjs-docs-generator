const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const matter = require('gray-matter');

// NextJS app server
app.prepare().then(() => {
  createServer((req, res) => {
    if(req.method == 'POST') {
        if(req.url === '/page/create/default') {
            var body = '';
    
            req.on('data', (data) => {
                body += data
            });
    
            req.on('end', () => {
                const data = JSON.parse(body);
    
                // Get the base directory
                const baseDir = path.resolve(__dirname, '..');
    
                if(fs.existsSync(baseDir + `/markdown/${data.header}/${data.fileName}.md`)) {
                    res.writeHead(409, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ status: 'failure', reason: 'file_already_exists' }));
                    return;
                }

                const mdData = getMdFile(data.sidebarName, data.order)
    
                // If header directory doesn't exist, make it
                if(!fs.existsSync(baseDir + `/markdown/${data.header}`)) {
                    fs.mkdirSync(baseDir + `/markdown/${data.header}`);
                }

                // Copy template page file into pages directory, with file name
                fs.writeFileSync(baseDir + `/markdown/${data.header}/${data.fileName}.md`, mdData);
    
                // Return successful response
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ status: 'success' }));
            });
        }
        else if(req.url === '/md/save') {
            var body = '';
    
            req.on('data', (data) => {
                body += data
            });
    
            req.on('end', () => {
                const data = JSON.parse(body);

                // Get the base directory
                const baseDir = path.resolve(__dirname, '..');

                const fileContents = fs.readFileSync(baseDir + `/markdown${data.fileName}`, 'utf8')
	
                // Use gray-matter to parse the post metadata section
                const matterResult = matter(fileContents)

                const mdData = getMdFileWithContent(matterResult.data.sidebarText, data.mdData, matterResult.data.order);

                // Copy template page file into pages directory, with file name
                fs.writeFileSync(baseDir + `/markdown${data.fileName}`, mdData);
    
                // Return successful response
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ status: 'success' }));
            });
        }
        else if(req.url === '/theme/set') {
            var body = '';
    
            req.on('data', (data) => {
                body += data
            });
    
            req.on('end', () => {
                const data = JSON.parse(body);

                // Get the base directory
                const baseDir = path.resolve(__dirname, '..');

                fse.copyFileSync(baseDir + `/internal/themes/${data.themeName}.css`, baseDir + '/styles/variables.css');
    
                // Return successful response
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ status: 'success' }));
            });
        }
    }
    else {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true)
        const { pathname, query } = parsedUrl

        app.render(req, res, '/', query)

        //handle(req, res, parsedUrl)
    }
  }).listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
});

function getMdFile(sidebarText, order) {
    const md = `---
sidebarText: ${sidebarText}
order: ${order}
---
# Add and edit content

Use the buttons throughout this page to create and edit elements. Hover over existing elements to show the buttons!

## Prefer editing markdown?

If you would like to edit the markdown instead, you can open the generated .md file in your favorite code editor.

The file is located inside the "markdown" folder in the root of the project. It will have a name similar to the one you 
entered (spaces are replaced with "-", and non-alphanumeric characters are removed).
\
\
**When editing files directly, please be aware of the following:**
- Do not change file names`

    return md;
}

function getMdFileWithContent(sidebarText, content, order) {
    const md = `---
sidebarText: ${sidebarText}
order: ${order}
---
${content}`

    return md;
}