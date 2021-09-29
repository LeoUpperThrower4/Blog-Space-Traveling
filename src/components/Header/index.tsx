import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <Link href="/">
      <a>
        <div className={styles.container}>
          <img alt="logo" src="/logo.svg" />
        </div>
      </a>
    </Link>
  );
}
