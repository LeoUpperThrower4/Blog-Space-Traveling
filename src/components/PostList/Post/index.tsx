import { FiUser, FiCalendar } from 'react-icons/fi';

import styles from './styles.module.scss';

// Terceiro lugar que eu uso a mesma interface para o mesmo intuito...
interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostListItemProps {
  post: Post;
}

export function PostListItem({ post }: PostListItemProps): JSX.Element {
  return (
    <li className={styles.container}>
      <div className={styles.content}>
        <h2>{post.data.title}</h2>
        <p>{post.data.subtitle}</p>
        <div className={styles.info}>
          <FiCalendar color="#bbb" />
          <time>{post.first_publication_date}</time>
          <FiUser color="#bbb" />
          <p>{post.data.author}</p>
        </div>
      </div>
    </li>
  );
}
