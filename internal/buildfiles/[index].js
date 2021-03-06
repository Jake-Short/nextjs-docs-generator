import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/index.module.css';

import matter from 'gray-matter';

import Sidebar from '../components/sidebar';
import CodeBlock from '../components/codeblock';
import IndexContent from '../components/indexcontent';

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
	const router = useRouter();
    const [mdContent, setMdContent] = useState(null);
	const [isIndex, setIsIndex] = useState(false);

    useEffect(() => {
		if(router.asPath === '/') {
			setIsIndex(true);
		}
		else {
			setIsIndex(false);
		}

		const matchedRouteItem = props.sidebarData.find(item => item.link === router.asPath);
		const mdCont = matchedRouteItem?.content;

		setMdContent(mdCont);
	}, [router]);
	
	if(isIndex) {
		return (
			<IndexContent {...props} />
		)
	}

    // Production code
    return (
        <div className={styles.container}>
            <Head>
                <title>NextJS Documentation Generator</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.main}>
                <Sidebar array={props.finalSidebarArray} prod={true} />

                <div className={styles.content}>
                    <div className={styles.contentInner}>
                        {mdContent ?
                            <ReactMarkdown
                                source={mdContent}
                                parserOptions={{ commonmark: true }}
								renderers={{ code: CodeBlock, link: LinkRenderer, blockquote: BlockquoteRenderer }}
								escapeHtml={false}
                            />
                        : null}
                    </div>
                </div>
            </div>
        </div>
    )
}