const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');

let currVersion = JSON.parse(fs.readFileSync(`${baseDir}/package.json`, 'utf-8')).version;

console.log('');
console.log(`You are on version ${chalk.cyan.bold(currVersion)}.`);
console.log(`${chalk.dim('Want to update? Run')} ${chalk.cyan('yarn update')}`);
console.log('');