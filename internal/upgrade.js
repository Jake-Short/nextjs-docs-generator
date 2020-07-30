const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const download = require('download-git-repo');

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
				const internalDir = path.resolve(__dirname);
				const baseDir = path.resolve(__dirname, '..');

				if(!fs.existsSync(internalDir + '/.temp')) {
					fs.mkdirSync(internalDir + '/.temp');
				}

				console.log('');
				console.log(`${chalk.blue('Downloading repository...')}`);
				console.log('');

				
				download('Jake-Short/nextjs-docs-generator#main', `${internalDir}/.temp`, (error) => {
					if(error) {
						console.log(`${chalk.red.bold('Error: ')} There was a problem downloading the repository. (${error})`);
						console.log(`Update aborted.`);
						console.log('');
					}
					else {
						console.log(`${chalk.blue('Repository downloaded!')}`);
						console.log('');
						console.log(`${chalk.blue('Writing files...')}`);
						console.log('');

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
						fs.unlinkSync(`${internalDir}/.temp`);

						console.log(`${chalk.green.bold('Success!')} Your project has been updated.`);
						console.log('');
					}
				})
			}
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