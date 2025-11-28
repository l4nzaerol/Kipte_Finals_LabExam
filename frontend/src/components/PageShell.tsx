import type { ReactNode } from 'react';
import NavBar from './NavBar';

type Props = {
  children: ReactNode;
  hero?: ReactNode;
};

const PageShell = ({ children, hero }: Props) => {
  return (
    <div className="aurora-shell">
      <NavBar />
      <div className="content-frame">
        {hero && <section className="page-hero">{hero}</section>}
        {children}
      </div>
    </div>
  );
};

export default PageShell;

