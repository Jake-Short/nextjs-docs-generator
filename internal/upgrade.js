const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const download = require('download-git-repo');

console.log('');
console.log(`${chalk.blue('Downloading repository...')}`);
console.log('');

const internalDir = path.resolve(__dirname);
const baseDir = path.resolve(__dirname, '..');

if(!fs.existsSync(internalDir + '/.temp')) {
	fs.mkdirSync(internalDir + '/.temp');
}
download('Jake-Short/nextjs-docs-generator#main', `${internalDir}/.temp`, (error) => {
	if(error) {
		console.log(`${chalk.red.bold('Error: ')} There was a problem downloading the repository. (${error})`);
		console.log(`Update aborted.`);
		console.log('');
	}
	else {
		let version = JSON.parse(fs.readFileSync(`${internalDir}/.temp/package.json`, 'utf-8')).version;

		let currPackageContents = JSON.parse(fs.readFileSync(`${baseDir}/package.json`, 'utf-8'));
		let currVersion = JSON.parse(fs.readFileSync(`${baseDir}/package.json`, 'utf-8')).version;

		if(currVersion === version) {
			console.log('');
			console.log(`${chalk.cyan('You are on the latest version!')} Aborting update.`);
			console.log('');

			// Delete .temp directory
			fse.removeSync(`${internalDir}/.temp`);

			return;
		}

		console.log('');
		console.log(`You are upgrading from version ${chalk.cyan.bold(currVersion)} to ${chalk.cyan.bold(version)}.`);
		console.log('');

		inquirer.prompt([
			{
				type: 'checkbox',
				name: 'Folders to update',
				message: () => console.log(`${chalk.cyan.bold('Update type: ')} What folders would you like to update?`),
				choices: ['internal', 'styles', 'components', 'pages']
			}
		])
		.then(answers => {
			console.log('');
			const foldersToUpdate = answers['Folders to update'];
			const consoleLogString = `${chalk.red.bold('Warning: ')} This will ${chalk.bold('clear')} the contents of these folders: ${chalk.cyan(`${foldersToUpdate.join(', ')}`)}.`
			
			if(foldersToUpdate.length < 1) {
				console.log(`${chalk.cyan(`You didn't select any files!`)} Aborting update.`);
				console.log('');

				// Delete .temp directory
				fse.removeSync(`${internalDir}/.temp`);

				return;
			}
		
			inquirer.prompt([
				{
					type: 'confirm',
					name: 'Continue',
					message: () => console.log(consoleLogString),
					default: false
				}
			])
			.then(res => {
				if(res.Continue === true) {
					// Trigger update
					if(res.Continue === true) {
						// Update package.json version to new version
						currPackageContents.version = version;
						
						// Write new package.json into site folder
						fs.writeFileSync(baseDir + '/package.json', JSON.stringify(currPackageContents, null, 4));
		
						// Copy selected folders below
						if(foldersToUpdate.includes('internal')) {
							fse.copySync(`${internalDir}/.temp/internal`, `${baseDir}/internal`);
						}

						if(foldersToUpdate.includes('styles')) {
							fse.copySync(`${internalDir}/.temp/styles`, `${baseDir}/styles`);
						}

						if(foldersToUpdate.includes('components')) {
							fse.copySync(`${internalDir}/.temp/components`, `${baseDir}/components`);
						}

						if(foldersToUpdate.includes('pages')) {
							fse.copySync(`${internalDir}/.temp/pages`, `${baseDir}/pages`);
						}

						// Delete .temp directory
						fse.removeSync(`${internalDir}/.temp`);

						console.log(`${chalk.green.bold('Success!')} Your project has been updated.`);
						console.log('');
					}
				}
				else {
					// Delete .temp directory
					fse.removeSync(`${internalDir}/.temp`);
				}
			})
			.catch(error => {
				console.log(`${chalk.red.bold('Error: ')} An error occured. (${error})`)
			});
		})
		.catch(error => {
			if(error.isTtyError) {
				// Prompt couldn't be rendered in the current environment
				console.log(`${chalk.red.bold('Error: ')} The current environment is unsupported.`)
			} else {
				// Something else when wrong
				console.log(`${chalk.red.bold('Error: ')} An error occured. (${error})`)
			}
		});
	}
})