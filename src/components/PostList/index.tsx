import { PostListItem } from './Post';
import styles from './styles.module.scss';

export function PostList(): JSX.Element {
  return (
    <ul className={styles.listContainer}>
      <PostListItem />
      <PostListItem />
      <PostListItem />
    </ul>
  );
}
