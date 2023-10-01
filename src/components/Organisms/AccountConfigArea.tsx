import { useNavigate } from 'react-router-dom';
import { ListGroup, ListItem } from 'components/Atoms/List';
import style from 'components/Organisms/AccountConfigArea.module.css';

import { AccountList } from 'components/Molecules/AccountList';

type Props = {
  onClick?: () => void;
};

export const AccountConfigArea = ({ onClick }: Props) => {
  return (
    <div className={style.accountlist} onClick={onClick}>
      <div>
        <AccountList />

        <ListGroup>
          <ListItem destination="/app/account/create">新しいアカウントを作成</ListItem>
          <ListItem destination="/app/account/login">既存のアカウントを追加</ListItem>
        </ListGroup>
      </div>
    </div>
  );
};
