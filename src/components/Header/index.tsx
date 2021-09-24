import styles from './header.module.scss';

export function Header(): JSX.Element {
  return (
    <div className={styles.container}>
      <img alt="logo" src="logo.svg" />
    </div>
  );
}
