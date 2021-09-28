/* eslint-disable react/no-danger */
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { format } from 'date-fns';
import { RichText } from 'prismic-dom';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    image: {
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
}

export default function Post({ post }: PostProps): JSX.Element {
  const timeToRead = Math.ceil(
    post.data.content.reduce((prev, curr) => {
      return prev + RichText.asText(curr.body).split(' ').length;
    }, 0) / 200
  );
  return (
    <>
      <Head>
        <title>spacetraveling | {post.data.title}</title>
      </Head>
      <div className={styles.container}>
        <img src={post.data.image.url ?? ''} alt={post.data.title} />
        <main className={styles.main}>
          <div className={styles.header}>
            <h1>{post.data.title}</h1>
            <div className={styles.info}>
              <div>
                <FiCalendar />
                <span>{post.first_publication_date}</span>
              </div>
              <div>
                <FiUser />
                <span>{post.data.author}</span>
              </div>
              <div>
                <FiClock />
                <span>{timeToRead} min</span>
              </div>
            </div>
          </div>
          {post.data.content.map(item => (
            <article>
              <h2 dangerouslySetInnerHTML={{ __html: item.heading }} />
              <div
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(item.body) }}
              />
            </article>
          ))}
        </main>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query();

  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const { slug } = context.params;
  const response = (await prismic.getByUID('post', slug as string, {
    lang: 'pt-br',
  })) as Post;

  const post = {
    ...response,
    first_publication_date: format(
      new Date(response.first_publication_date),
      'PP',
      {
        locale: ptBR,
      }
    ),
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  };
};
