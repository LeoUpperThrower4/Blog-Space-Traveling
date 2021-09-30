import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
  preview?: boolean;
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

export default function Home({
  postsPagination,
  preview,
}: HomeProps): JSX.Element {
  const [loadedPosts, setLoadedPosts] = useState(
    treatPosts(postsPagination.results)
  );
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
    <>
      <main className={styles.container}>
        <div className={styles.content}>
          <ul>
            {loadedPosts.map(post => (
              <Link href={`/post/${post.uid}`}>
                <li key={post.uid}>
                  <h1>{post.data.title}</h1>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.info}>
                    <FiCalendar color="#bbb" />
                    <time>{post.first_publication_date}</time>
                    <FiUser color="#bbb" />
                    <p>{post.data.author}</p>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
          {nextPage && (
            <button type="button" onClick={() => handleLoadMorePostsAsync()}>
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
      {preview && (
        <aside>
          <Link href="/api/exit-preview">
            <a>Sair do modo Preview</a>
          </Link>
        </aside>
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const { next_page, results } = await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    {
      pageSize: 2,
      ref: previewData?.ref ?? null,
      orderings: '[document.first_publication_date desc]',
    }
  );

  const postsPagination = {
    next_page,
    results,
  };

  return {
    props: {
      postsPagination,
      preview,
    },
    revalidate: 60, // 1 minuto
  };
};
