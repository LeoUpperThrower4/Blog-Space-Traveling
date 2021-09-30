import { useEffect, useRef } from 'react';

export default function CommentsBox(): JSX.Element {
  const commentBox = useRef<HTMLDivElement>();

  useEffect(() => {
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('src', 'https://utteranc.es/client.js');
    scriptEl.setAttribute('crossorigin', 'anonymous');
    scriptEl.setAttribute('async', 'true');
    scriptEl.setAttribute('repo', 'LeoUpperThrower4/RJS-Desafio-05');
    scriptEl.setAttribute('issue-term', 'pathname');
    scriptEl.setAttribute('theme', 'photon-dark');
    commentBox.current.appendChild(scriptEl);
  }, []);

  return <div ref={commentBox} />;
}
