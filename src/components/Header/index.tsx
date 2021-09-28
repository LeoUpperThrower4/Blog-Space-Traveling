import Link from 'next/link';
import styles from './header.module.scss';

export function Header(): JSX.Element {
  return (
    <div className={styles.container}>
      <Link href="/">
        <a>
          <img alt="logo" src="/logo.svg" />
        </a>
      </Link>
    </div>
  );
}
