import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/index.module.css';

import matter from 'gray-matter';

import Sidebar from '../components/sidebar';
import CodeBlock from '../components/codeblock';
import IndexContent from '../components/indexcontent';

const ReactMarkdown = require('react-markdown');

export async function getStaticProps() {
	const fs = require('fs');
	const path = require('path');

	const baseDir = path.resolve(process.cwd());

	// Get markdown files location
	const markdownDir = baseDir + '/markdown';

	// Get markdown files
	const mdFiles = fs.readdirSync(markdownDir);

	// Loop through files and get data
	const allPostsData = mdFiles.map(fileName => {
		// Remove ".md" from file name to get id
		const id = fileName.replace(/\.md$/, '')
	
		// Read markdown file as string
		const fullPath = path.join(markdownDir, fileName)
		const fileContents = fs.readFileSync(fullPath, 'utf8')
	
		// Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents)
	
		// Combine the data with the id
		return {
			id,
			content: matterResult.content,
			...matterResult.data
		}
	});

	const sidebarDataArray = allPostsData.map(item => {
		return {
			link: item.link,
			text: item.sidebarText,
			header: item.sidebarHeader,
			content: item.content,
			order: item.order
		}
	});

	var finalSidebarArr = [];
	sidebarDataArray.forEach(item => {
		const indexOfHeaderItem = finalSidebarArr.findIndex(obj => item?.header === obj.header);

		// If index is not -1, indicating an object with specified header already exists in array
		if(indexOfHeaderItem !== -1) {
			finalSidebarArr[indexOfHeaderItem].content.push({ link: item.link, text: item.text, content: item.content, order: item.order })
		}
		else {
			finalSidebarArr.push({
				header: item.header,
				content: [ { link: item.link, text: item.text, content: item.content, order: item.order } ]
			})
		}
	});

	finalSidebarArr.forEach(item => {
		item.content.sort((a, b) => (a.order > b.order) ? 1 : -1)
	});

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