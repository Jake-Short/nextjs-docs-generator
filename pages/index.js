import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/index.module.css';

import matter from 'gray-matter';

import Sidebar from '../components/sidebar';
import CodeBlock from '../components/codeblock';
import IndexContent from '../components/indexcontent';

import TextareaAutosize from 'react-textarea-autosize';

const ReactMarkdown = require('react-markdown');

export async function getStaticPaths() {
	const fs = require('fs');
	const path = require('path');

	const baseDir = path.resolve(process.cwd());

	// Get markdown files location
	const markdownDir = baseDir + '/markdown';

	// Get markdown files
	const mdFiles = fs.readdirSync(markdownDir);

	var allPostsData = [];
	// Loop through files and get data
	mdFiles.forEach(fileName => {
		if(fs.lstatSync(`${markdownDir}/${fileName}`).isDirectory()) {
			const mdFilesSub = fs.readdirSync(`${markdownDir}/${fileName}`);

			var subPostsData = []
			mdFilesSub.forEach(subFileName => {
				if(subFileName.startsWith('_')) {
					return;
				}

				// Combine the data with the id
				subPostsData.push({
					params: {
						id: path.parse(subFileName).name
					}
				});
			});

			allPostsData = allPostsData.concat(subPostsData);
		}
	});

	return {
		paths: allPostsData,
	  	fallback: false
	};
}

export async function getStaticProps() {
	const fs = require('fs');
	const path = require('path');

	const baseDir = path.resolve(process.cwd());

	// Get markdown files location
	const markdownDir = baseDir + '/markdown';

	// Get markdown files
	const mdFiles = fs.readdirSync(markdownDir);

	// { header: "Foo title", order: 1 }
	var headerOrder = [];
	var allPostsData = [];
	// Loop through files and get data
	mdFiles.forEach(fileName => {
		if(fs.lstatSync(`${markdownDir}/${fileName}`).isDirectory()) {
			const mdFilesSub = fs.readdirSync(`${markdownDir}/${fileName}`);

			var subPostsData = [];
			mdFilesSub.forEach(subFileName => {
				if(subFileName.startsWith('_')) {
					if(subFileName === '_order') {
						const orderContent = fs.readFileSync(`${markdownDir}/${fileName}/${subFileName}`).toString();
						headerOrder.push({ header: fileName, order: orderContent });
					}

					return;
				}

				// Remove ".md" from file name to get id
				const id = subFileName.replace(/\.md$/, '')

				// Read markdown file as string
				const fullPath = path.join(`${markdownDir}/${fileName}`, subFileName)
				const fileContents = fs.readFileSync(fullPath, 'utf8')
			
				// Use gray-matter to parse the post metadata section
				var matterResult = matter(fileContents)
			
				matterResult.data.sidebarHeader = fileName;
				matterResult.data.filePathMD = `/${fileName}/${subFileName}`;
				matterResult.data.link = `/${path.parse(subFileName).name}`;
				// Combine the data with the id
				subPostsData.push({
					id,
					content: matterResult.content,
					...matterResult.data
				});
			});

			allPostsData = allPostsData.concat(subPostsData);
		}
	});

	const sidebarDataArray = allPostsData.map(item => {
		return {
			link: item.link,
			text: item.sidebarText,
			header: item.sidebarHeader,
			content: item.content,
			order: item.order,
			filePathMD: item.filePathMD
		}
	});

	var finalSidebarArr = [];
	sidebarDataArray.forEach(item => {
		const indexOfHeaderItem = finalSidebarArr.findIndex(obj => item?.header === obj.header);

		// If index is not -1, indicating an object with specified header already exists in array
		if(indexOfHeaderItem !== -1) {
			finalSidebarArr[indexOfHeaderItem].content.push({...item})
		}
		else {
			finalSidebarArr.push({
				header: item.header,
				content: [ {...item} ]
			})
		}
	});

	finalSidebarArr.forEach(item => {
		item.content.sort((a, b) => (a.order > b.order) ? 1 : -1);

		// Sort headers
		const headerOrderItem = headerOrder.find(i => i.header === item.header);
		if(headerOrderItem) {
			item.order = headerOrderItem.order;
		}
	});

	finalSidebarArr.sort((a, b) => (a.order > b.order) ? 1 : -1);

    return {
        props: {
			sidebarData: allPostsData,
			finalSidebarArray: finalSidebarArr
        }
    }
}

function LinkRenderer(props) {
	return <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a>
}

function BlockquoteRenderer(props) {
	const textValue = props.children[0]?.props?.children[0]?.props?.children;

	if(textValue?.charAt(0) + textValue?.charAt(1) === '! ') {
		return <blockquote className='blockquote-alert'>{textValue.substr(2)}</blockquote>
	}
	else if(textValue?.charAt(0) + textValue?.charAt(1) === '? ') {
		return <blockquote className='blockquote-warning'>{textValue.substr(2)}</blockquote>
	}
	else {
		return <blockquote>{props.children}</blockquote>
	}
}

export default function Home(props) {
	// DEVELOPMENT CODE BELOW
	if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
		// Development code
		return (
			<div className={styles.container}>
				<Head>
					<title>NextJS Documentation Generator</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<div className={styles.main}>
					<Sidebar array={props.finalSidebarArray} />

					<DevelopmentContent {...props} />
				</div>
			</div>
		)
	}
	// PRODUCTION CODE BELOW (this should not ever be shown, as the built version will use a different index.js file)
	else {
		// Production code
		return (
			<div className={styles.container}>
				<div className={styles.main}>
					<Sidebar array={props.finalSidebarArray} />

					<div className={styles.content}>
						<div className={styles.contentInner}>
							<ReactMarkdown
								source={`# An error occured. Please try rebuilding, and if the issue persists, create an issue.`}
								parserOptions={{ commonmark: true }}
								renderers={{ code: CodeBlock, link: LinkRenderer, blockquote: BlockquoteRenderer }}
								escapeHtml={false}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}


function DevelopmentContent(props) {
	const router = useRouter();

	const [editingMarkdown, setEditingMarkdown] = useState(false);
	const [mdContentEditorValue, setMdContentEditorValue] = useState('');
	const [isIndex, setIsIndex] = useState(false);
	const [statusText, setStatusText] = useState('Saved!');
	const [mdFileLink, setMdFileLink] = useState('');

	useEffect(() => {
		if(router.asPath === '/') {
			setIsIndex(true);
		}
		else {
			setIsIndex(false);
		}

		const matchedRouteItem = props.sidebarData.find(item => item.link === router.asPath);
		const mdCont = matchedRouteItem?.content;

		setMdContentEditorValue(mdCont);
		setMdFileLink(matchedRouteItem?.filePathMD);
	}, []);

	useEffect(() => {
		const timeout = setTimeout(() => {
			// Save file
			if(statusText !== 'Saved!') {
				fetch('http://localhost:3000/md/save', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ fileName: mdFileLink, mdData: mdContentEditorValue })
				})
				.then(res => res.json())
				.then(data => {
					setStatusText('Saved!');
				});
			}
		}, 5000)
	
		// if this effect run again, because `value` changed, we remove the previous timeout
		return () => clearTimeout(timeout)
	}, [mdContentEditorValue])
	
	const handleMdTextChange = (val) => {
		setMdContentEditorValue(val);
		setStatusText('Not Saved')
	}

	if(isIndex) {
		return (
			<IndexContent {...props} />
		)
	}

	return (
		<div className={styles.content}>
			<div className={styles.contentTopButtons}>
				<button className={styles.switchButton} onClick={() => setEditingMarkdown(!editingMarkdown)}>
					{editingMarkdown ? 'Switch to Visual Preview' : 'Switch to Markdown Editing'}
				</button>

				{editingMarkdown ?
				<p className={styles.statusText} style={{ color: `${statusText === 'Saved!' ? '#10ac84' : '#d63031'}` }}>
					{statusText}
				</p> : null}
			</div>
			
			{editingMarkdown ?
			<div className={styles.mdEditor}>
				<TextareaAutosize className={styles.mdTextArea} value={mdContentEditorValue} onChange={e => handleMdTextChange(e.target.value)} />

				{mdContentEditorValue ?
					<ReactMarkdown
						className={styles.mdEditorResult}
						source={mdContentEditorValue}
						parserOptions={{ commonmark: true }}
						renderers={{ code: CodeBlock, link: LinkRenderer, blockquote: BlockquoteRenderer }}
						escapeHtml={false}
					/>
				: null}
			</div> : null}
				
			{editingMarkdown ? null :
			<div className={styles.contentInner} style={{ paddingTop: 'calc(5% + 70px)' }}>
				{mdContentEditorValue ?
					<ReactMarkdown
						source={mdContentEditorValue}
						parserOptions={{ commonmark: true }}
						renderers={{ code: CodeBlock, link: LinkRenderer, blockquote: BlockquoteRenderer }}
						escapeHtml={false}
					/>
				: null}

				{router.asPath === '/styling-theming' ? 
				<ThemeSection {...props} />
				: null}
			</div>}
		</div>
	)
}

// The theme section will only be shown in development mode, on the styling-theming page
function ThemeSection(props) {
	const changeTheme = (theme) => {
		fetch('http://localhost:3000/theme/set', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ themeName: theme })
		})
		.then(res => res.json())
		.then(() => {
		
		});
	}

	return (
		<div>
			<h2>Themes</h2>

			<p>
				You may select a pre-built theme below.
			</p>

			<blockquote>
				Note: This section is only shown in development. If you keep this page, this section will *not* show in the final build.
			</blockquote>

			<blockquote className='blockquote-alert'>
				Warning: This will clear the contents of the variables.css file!
			</blockquote>

			<div className={styles.themeCardsContainer}>

				<div className={styles.themeCard} onClick={() => changeTheme('default')}>
					<p className={styles.themeCardHeader}>
						Default
					</p>

					<p className={styles.themeCardBody}>
						Default light theme.
					</p>
				</div>

				<div className={styles.themeCard} onClick={() => changeTheme('defaultdark')}>
					<p className={styles.themeCardHeader}>
						Default Dark
					</p>

					<p className={styles.themeCardBody}>
						Default dark theme.
					</p>
				</div>

				<div className={styles.themeCard} onClick={() => changeTheme('tangerine')}>
					<p className={styles.themeCardHeader}>
						Tangerine
					</p>

					<p className={styles.themeCardBody}>
						A light + orange theme. 
					</p>
				</div>

				<div className={styles.themeCard} onClick={() => changeTheme('ocean')}>
					<p className={styles.themeCardHeader}>
						Ocean
					</p>

					<p className={styles.themeCardBody}>
						A dark + blue theme. 
					</p>
				</div>

			</div>
		</div>
	)
}