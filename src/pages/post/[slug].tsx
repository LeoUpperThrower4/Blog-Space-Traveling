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

interface Post {
  first_publication_date: string | null;
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
}

interface PostProps {
  post: Post;
  preview: boolean;
}

export default function Post({ post, preview }: PostProps): JSX.Element {
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
        <CommentsBox />
      </div>
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

  return {
    props: {
      post,
      preview,
    },
    revalidate: 60 * 60, // 1 hora
  };
};
