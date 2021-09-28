import { useRouter } from 'next/router';
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
  const router = useRouter();

  function handlePostClick(): void {
    router.push(`/post/${post.uid}`);
  }

  return (
    <li key={post.uid}>
      <div
        role="button"
        className={styles.content}
        onClick={handlePostClick}
        onKeyDown={handlePostClick}
        tabIndex={0}
      >
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
