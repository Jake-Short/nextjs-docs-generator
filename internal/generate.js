const chalk = require('chalk');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

// Initial print to console
console.log("Beginning generation of docs site...");

// Run the generation process
runGen();

function runGen() {
    var parent = path.resolve(__dirname, '..');

    console.log(`${chalk.blue('\nCopying files...')}`);

    if(!fs.existsSync(parent + '/site')) {
        fs.mkdirSync(parent + '/site');
    }
    else {
        fs.rmdirSync(parent + '/site', { recursive: true });
        fs.mkdirSync(parent + '/site');
    }

    const output = path.resolve(__dirname, '../site');

    // Read package.json and remove keys
    let jsonData = JSON.parse(fs.readFileSync(parent + '/package.json', 'utf-8'));
    delete jsonData.scripts.gen;
    delete jsonData.scripts.generate;
    jsonData.scripts.build = "next build";
    jsonData.scripts.start = "next start";
    jsonData.scripts.export = "next export";
    jsonData.scripts.dev = "next";

    // Write new package.json into site folder
    fs.writeFileSync(output + '/package.json', JSON.stringify(jsonData, null, 4));

    // Copy index.js to [id].js and index.js
    fse.copySync(parent + '/internal/buildfiles/[index].js', output + '/pages/[id].js');
    fse.copySync(parent + '/internal/buildfiles/index.js', output + '/pages/index.js');

    fs.readdirSync(parent).forEach(file => {
        // Files not to copy
        if(file.startsWith('.') || file === 'node_modules' || file === 'site' || file === 'internal' || file === 'package.json' || file === 'pages') {
            return;
        }

        fse.copySync(file, `${output}/${file}`);
    });

    // Read pages directory and copy elements
    fs.readdirSync(parent + '/pages').forEach(file => {
        // Don't copy index.js file
        if(file === 'index.js') {
            return;
        }

        fse.copySync(parent + `/pages/${file}`, `${output}/pages/${file}`);
    })
    
    console.log(`${chalk.blue('\nInstalling NPM modules...')}`);

    completionHandler('success', { outputPath: output });
}




function completionHandler(type, params) {
    if(type === 'success') {
        console.log()
        console.log(`${chalk.green.bold('Success!')}`)
        console.log()
        console.log(`Generated NextJS docs site in ${chalk.cyan(params.outputPath)}`)
        console.log()
        console.log(`${chalk.bold('Inside that folder, you can run all NextJS commands, such as:')}`)
        console.log()
        console.log(chalk.cyan(`  yarn dev`))
        console.log('    Starts the development server.')
        console.log()
        console.log(chalk.cyan(`  yarn build`))
        console.log('    Builds the app for production.')
        console.log()
        console.log(chalk.cyan(`  yarn start`))
        console.log('    Runs the built app in production mode.')
        console.log()
        console.log('You can begin by typing:')
        console.log()
        console.log(chalk.cyan('  cd') + ' site')
        console.log(
            `  ${chalk.cyan(`yarn && yarn dev`)}`
        )
        console.log()
    }

    process.exit();
}