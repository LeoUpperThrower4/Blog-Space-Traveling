/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import CommentsBox from '../../components/CommentsBox';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';
import LeavePreviewButton from '../../components/LeavePreviewButton';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
  uid?: string;
  id: string;
}

interface PostProps {
  post: Post;
  preview: boolean;
  prevPost?: Post;
  nextPost?: Post;
}

export default function Post({
  post,
  preview,
  prevPost,
  nextPost,
}: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  const timeToRead = Math.ceil(
    post.data.content.reduce((prev, curr) => {
      return prev + RichText.asText(curr.body).split(' ').length;
    }, 0) / 200
  );

  const formattedPost = {
    ...post,
    first_publication_date: format(
      new Date(post.first_publication_date),
      'PP',
      {
        locale: ptBR,
      }
    ),
    last_publication_date: format(
      new Date(post.last_publication_date),
      "PP', às 'k':'m",
      {
        locale: ptBR,
      }
    ),
  };

  return (
    <>
      <Head>
        <title>spacetraveling | {formattedPost.data.title}</title>
      </Head>
      <div className={styles.container}>
        <img
          src={formattedPost.data.banner.url ?? ''}
          alt={formattedPost.data.title}
        />
        <main className={styles.main}>
          <div className={styles.header}>
            <h1>{formattedPost.data.title}</h1>
            <div className={styles.info}>
              <div>
                <FiCalendar />
                <span>{formattedPost.first_publication_date}</span>
              </div>
              <div>
                <FiUser />
                <span>{formattedPost.data.author}</span>
              </div>
              <div>
                <FiClock />
                <span>{timeToRead} min</span>
              </div>
            </div>
            {post.last_publication_date !== post.first_publication_date && (
              <p>* editado em {formattedPost.last_publication_date}</p>
            )}
          </div>
          {formattedPost.data.content.map(item => (
            <article>
              <h2 dangerouslySetInnerHTML={{ __html: item.heading }} />
              <div
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(item.body) }}
              />
            </article>
          ))}
        </main>
        <aside>
          <div className={styles.postsNavigation}>
            {prevPost ? (
              <Link href={`/post/${prevPost.uid}`}>
                <div>
                  <h3>{prevPost.data.title}</h3>
                  <button type="button">Post anterior</button>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextPost && (
              <Link href={`/post/${nextPost.uid}`}>
                <div>
                  <h3>{nextPost.data.title}</h3>
                  <button type="button">Próximo post</button>
                </div>
              </Link>
            )}
          </div>
          <CommentsBox />
          {preview && <LeavePreviewButton />}
        </aside>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = (
    await prismic.query(Prismic.Predicates.at('document.type', 'post'), {
      pageSize: 5,
    })
  ).results;

  return {
    paths: posts.map(post => {
      return { params: { slug: post.uid } };
    }),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  preview = false,
  previewData,
  params,
}) => {
  const prismic = getPrismicClient();
  const { slug } = params;

  const post = (await prismic.getByUID('post', slug as string, {
    lang: 'pt-br',
    ref: previewData?.ref ?? null,
  })) as Post;

  const prevPost = (
    await prismic.query(Prismic.Predicates.at('document.type', 'post'), {
      pageSize: 1,
      after: `${post.id}`,
      orderings: '[document.first_publication_date desc]',
    })
  ).results[0];

  const nextPost = (
    await prismic.query(Prismic.Predicates.at('document.type', 'post'), {
      pageSize: 1,
      after: `${post.id}`,
      orderings: '[document.first_publication_date]',
    })
  ).results[0];

  return {
    props: {
      post,
      preview,
      prevPost: prevPost ?? null,
      nextPost: nextPost ?? null,
    },
    revalidate: 60 * 60, // 1 hora
  };
};
