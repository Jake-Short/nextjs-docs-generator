import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/index.module.css';

import Sidebar from '../components/sidebar';
import CodeBlock from '../components/codeblock';

const ReactMarkdown = require('react-markdown');

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

export default function IndexContent(props) {
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

const mdContent = `
# Documentation

Use the links to the left to navigate the documentation.
`;