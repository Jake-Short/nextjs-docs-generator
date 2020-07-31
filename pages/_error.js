import Link from 'next/link';
import styles from '../styles/_error.module.css';

function Error({ statusCode }) {
    return (
		<div className={styles.errorContainer}>
			<div className={styles.centerContent}>
				<h1>
					Error
				</h1>

				<p>
					There was an error loading this page.
				</p>
			</div>

			<Link href="/">
				<a className={styles.button}>
					Go to Docs
				</a>
			</Link>
        </div>
	)
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}
  
export default Error;