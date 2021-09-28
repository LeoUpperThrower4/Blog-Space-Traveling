import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { PostList } from '../components/PostList';
import styles from './home.module.scss';
import { getPrismicClient } from '../services/prismic';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

function treatPosts(posts: Post[]): Post[] {
  const results = posts.map(post => {
    return {
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'PP',
        {
          locale: ptBR,
        }
      ),
    };
  });
  return results;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [loadedPosts, setLoadedPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function handleLoadMorePostsAsync(): Promise<void> {
    const fetchedPostsPagination = (await (
      await fetch(nextPage)
    ).json()) as PostPagination;

    const treatedNewPosts = treatPosts(fetchedPostsPagination.results);

    setLoadedPosts([...loadedPosts, ...treatedNewPosts]);
    setNextPage(fetchedPostsPagination.next_page);
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <PostList posts={loadedPosts} />
        {nextPage && (
          <button type="button" onClick={() => handleLoadMorePostsAsync()}>
            Carregar mais posts
          </button>
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    { pageSize: 5 }
  );

  const results = treatPosts(postsResponse.results);

  const postsPagination = {
    next_page: postsResponse.next_page,
    results,
  };

  return {
    props: {
      postsPagination,
    },
    revalidate: 60, // 1 minuto
  };
};
