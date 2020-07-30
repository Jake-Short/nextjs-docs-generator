import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/sidebar.module.css';

import { ChevronDown, ChevronUp, Plus, Menu, X } from 'react-feather';

export default function Sidebar(props) {
	// Update path to logo here
	const logo = require('../public/logo.svg');
	// Set to false to have no logo
	const logoIsShown = false;
	// Centered logo
	const centeredLogo = false;
	
	const [sidebarShown, setSidebarShown] = useState(true);

	useEffect(() => {
		// Hide sidebar initially on mobile
		if(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) <= 768) {
			setSidebarShown(false);
		}
	}, []);

    async function createSection() {
		const sectionName = prompt('Section name? (This will be the header text shown in the sidebar)', 'Getting started');
		if(!sectionName) {
			return;
		}

		const pageName = prompt('Page name? (This will be the text shown in the sidebar)', 'Quick start');

		if(pageName) {
			const fileName = pageName.toLowerCase().replace(/[^0-9a-zA-Z_ ]/g, '').replace(/\s\s+/g, ' ').replaceAll(' ', '-');
			
			const data = {
                fileName: fileName,
                sidebarName: pageName,
				header: sectionName,
				order: 1
			};

			fetch('http://localhost:3000/page/create/default', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(res => res.json())
			.then(data => {
				if(data.status === 'failure') {
					if(data.reason === 'file_already_exists') {
						alert(`File already exists. (Conflicting file: ${fileName}.md)`);
					}
					else {
						alert('An unknown error occured.');
					}

					return;
				}

				location.reload();
			});
		}
	}

	return (
		<React.Fragment>
			<div className={styles.sidebar} style={{ transform: `scaleX(${sidebarShown ? '1' : '0'})` }}>
				{logoIsShown ?
				<a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className={styles.sidebarLogoLink} style={{ justifyContent: `${centeredLogo ? 'center' : 'flex-start'}` }}>
					<img src={logo} className={styles.sidebarLogo} />
				</a> : null}

				{props.array.map((item, index) => {
					return (
						<SidebarSection header={item.header} links={item.content} key={index} prod={props.prod} />
					)
				})}

				{(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && !props.prod ?
				<div className={styles.sidebarSectionHeaderContainer} style={{ marginTop: '2rem' }} onClick={createSection}>
					<p className={styles.sidebarSectionHeader} style={{ color: 'var(--accent-color)' }}>
						Add Page in New Section
					</p>

					<Plus className={styles.sidebarSectionHeaderChevron} size={18} style={{ color: 'var(--accent-color)' }} />
				</div> : null}
			</div>

			<div className={styles.topBarMobile}>
				<div className={styles.topBarMobileInner} style={{ borderColor: `${sidebarShown ? 'var(--divider-color)' : 'transparent'}`, width: `${sidebarShown ? '250px' : '38px'}` }}>
					<X className={styles.menuBarIcon} style={{ marginLeft: `${sidebarShown ? '212px' : '0'}`, position: `${sidebarShown ? 'unset' : 'absolute'}`, transform: `scale(${sidebarShown ? '1' : '0'})` }} onClick={() => setSidebarShown(!sidebarShown)} size={28} />
					<Menu className={styles.menuBarIcon} style={{ marginLeft: `${sidebarShown ? '212px' : '0'}`, position: `${sidebarShown ? 'absolute' : 'unset'}`, transform: `scale(${sidebarShown ? '0' : '1'})` }} onClick={() => setSidebarShown(!sidebarShown)} size={28} />
				</div>
			</div>
		</React.Fragment>
	)
}

function SidebarSection(props) {
	/** Possible props:
	 * props.header: Title/header for section
	 * props.links: Array of links and text to show ([{ link: '/foo', text: 'Foo' }])
	 * props.router: Router passed from parent
	*/

	const [droppedDown, setDroppedDown] = useState(true);
    const router = useRouter();

	async function createPage() {
		const pageName = prompt('Page name? (This will be the text shown in the sidebar)', 'Quick start');

		if(pageName) {
			// Filters out non-alphanumeric characters, reduces multiple spaces to single space, then replaces spaces with -
			const fileName = pageName.toLowerCase().replace(/[^0-9a-zA-Z_ ]/g, '').replace(/\s\s+/g, ' ').replaceAll(' ', '-');
			
			const data = {
                fileName: fileName,
                sidebarName: pageName,
				header: props.header,
				order: props.links.length + 1
			};

			fetch('http://localhost:3000/page/create/default', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(res => res.json())
			.then(data => {
				if(data.status === 'failure') {
					if(data.reason === 'file_already_exists') {
						alert(`File already exists. (Conflicting file: ${fileName}.md)`);
					}
					else {
						alert('An unknown error occured.');
					}

					return;
				}

				location.reload();
			});
		}
	}

	return (
		<div className={styles.sidebarSection}>
            <div className={styles.sidebarSectionHeaderContainer} onClick={() => setDroppedDown(!droppedDown)}>
                <p className={styles.sidebarSectionHeader}>
                    {props.header}
                </p>

                {droppedDown ?
                <ChevronUp className={styles.sidebarSectionHeaderChevron} size={18} />
                :
                <ChevronDown className={styles.sidebarSectionHeaderChevron} size={18} />}
            </div>
	
			<div className={styles.sidebarSectionInner} style={{ height: `${droppedDown ? 'unset' : '0'}`, transform: `scaleY(${droppedDown ? '1' : '0'})` }}>
				{props.links.map((item, index) => (
					<Link href={item.link} key={index}>
						<a className={item.link === router.asPath ? styles.sidebarLinkActive : styles.sidebarLink}>
							{item.text}
						</a>
					</Link>
				))}

				{(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && !props.prod ?
				<p className={styles.sidebarLink} style={{ color: `var(--accent-color)`, fontWeight: '500', cursor: 'pointer' }} onClick={createPage}>
					Add Page

					<Plus className={styles.sidebarSectionHeaderChevron} size={18} style={{ color: 'var(--accent-color)', marginLeft: 'auto' }} />
				</p> : null}
			</div>
		</div>
	)
}





function useWindowSize() {
	const isClient = typeof window === 'object';
  
	function getSize() {
	  return {
		width: isClient ? window.innerWidth : undefined,
		height: isClient ? window.innerHeight : undefined
	  };
	}
  
	const [windowSize, setWindowSize] = useState(getSize);
  
	useEffect(() => {
	  if (!isClient) {
		return false;
	  }
	  
	  function handleResize() {
		setWindowSize(getSize());
	  }
  
	  window.addEventListener('resize', handleResize);
	  return () => window.removeEventListener('resize', handleResize);
	}, []); // Empty array ensures that effect is only run on mount and unmount
  
	return windowSize;
  }