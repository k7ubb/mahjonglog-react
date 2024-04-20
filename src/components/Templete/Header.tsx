import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import style from 'components/Templete/Header.module.css';

type Props = {
  children: ReactNode;
  destination?: string;
};

export const Header = ({ children, destination }: Props) => {
  const navigate = useNavigate();
  return (
    destination? 
      <div className={style.header}>
        <h1>{children}</h1>
        {/* エラー回避のためタグ変更 */}
        <button onClick={() => navigate(destination)}>
          <FontAwesomeIcon icon={faChevronLeft} />戻る
        </button>
      </div>
      :
      <div className={style.header}>
        <h1>{children}</h1>
      </div>
  );
};
