import { FiUser, FiCalendar } from 'react-icons/fi';

import styles from './styles.module.scss';

export function PostListItem(): JSX.Element {
  return (
    <li className={styles.container}>
      <div className={styles.content}>
        <h2>Como utilizar Hooks</h2>
        <p>Pensando em sincronização em vez de ciclos de vida</p>
        <div className={styles.info}>
          <FiCalendar color="#bbb" />
          <time>15 Mar 2021</time>
          <FiUser color="#bbb" />
          <p>Leonardo Silva</p>
        </div>
      </div>
    </li>
  );
}
