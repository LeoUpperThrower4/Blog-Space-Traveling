import { PostListItem } from './Post';
import styles from './styles.module.scss';

// Deixo aqui essa interface ou crio um arquivo de tipos pra ela?
// Os tipos são iguais e o intuito de uso também é o mesmo
interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps): JSX.Element {
  return (
    <ul className={styles.listContainer}>
      {posts.map(post => (
        <PostListItem post={post} />
      ))}
    </ul>
  );
}
