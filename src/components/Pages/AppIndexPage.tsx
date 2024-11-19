import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';
import { useHandleAuth } from '../../usecase/useHandleAuth';

export const AppIndexPage: React.FC = () => {
	const { submitLogout } = useHandleAuth();
	return (
		<>
			<AppWindow title="麻雀戦績共有アプリ">
				<ListGroup title={'アカウント'}>
					<ListItem linkTo="/app/login">ログイン</ListItem>
					<ListItem linkTo="/app/register">新規登録</ListItem>
				</ListGroup>
				<ListGroup>
					<ListItem onClick={async () => {
						await submitLogout();
					}}>ログアウト</ListItem>
				</ListGroup>
			</AppWindow>
		</>
	);
};
