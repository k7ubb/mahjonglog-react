import type { ReactNode } from 'react';
import style from 'components/Templete/AppArea.module.css';

type Props = {
  children: ReactNode
};

export const AppArea = ({ children }: Props) => {
  return (
    <div className={style.appArea}>
      <h1>{children}</h1>
    </div>
  );
};
