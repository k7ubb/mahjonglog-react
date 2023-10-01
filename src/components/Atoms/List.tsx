import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import style from 'components/Atoms/List.module.css';

type Props = {
  children: ReactNode;
  destination?: string;
  onClick?: () => void;
};

export const ListTitle = ({ children }: Props) => {
  return (
    <div className={style.listtitle}>
      {children}
    </div>
  );
};

export const ListGroup = ({ children }: Props) => {
  return (
    <div className={style.listgroup}>
      {children}
    </div>
  );
};

export const ListItem = ({ children, destination, onClick }: Props) => {
  const navigate = useNavigate();
  if (destination) {
    return (
      <div className={`${style.listitem} ${style.link}`} onClick={() => navigate(destination!)}>
        {children}
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    );
  }
  if (onClick) {
    return (
      <div className={`${style.listitem} ${style.button}`} onClick={onClick}>
        {children}
      </div>
    );
  }
  else {
    return (
      <div className={`${style.listitem}`}>
        {children}
      </div>
    );
  }
};
