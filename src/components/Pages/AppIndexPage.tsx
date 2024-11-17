import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';

export const AppIndexPage: React.FC = () => {
	return (
		<>
			<AppWindow title="麻雀戦績共有アプリ">
				<ListGroup title={'アカウント'}>
					<ListItem linkTo="/app/login">ログイン</ListItem>
					<ListItem linkTo="/app/register">新規登録</ListItem>
				</ListGroup>
			</AppWindow>
		</>
	);
};
