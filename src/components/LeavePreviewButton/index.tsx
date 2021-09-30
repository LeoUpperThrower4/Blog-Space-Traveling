import Link from 'next/link';

import styles from './styles.module.scss';

export default function LeavePreviewButton(): JSX.Element {
  return (
    <Link href="/api/exit-preview">
      <a className={styles.previewButton}>Sair do modo Preview</a>
    </Link>
  );
}
