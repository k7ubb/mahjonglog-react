import { useState } from 'react';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';
import { useHandleAuth } from '../../usecase/useHandleAuth';
import { useHandleUser } from '../../usecase/useHandleUser';

export const AppIndexPage: React.FC = () => {
	const { user } = useHandleUser();
	const { submitLogout } = useHandleAuth();
	const [loading, setLoading] = useState(false);
	
	return (
		<AppWindow title="麻雀戦績共有アプリ">
			{user
				? (
					<>
						<ListGroup title={'アカウント'}>
							<ListItem linkTo="/app/log">ログ</ListItem>
						</ListGroup>
						<ListGroup>
							<ListItem
								onClick={async () => {
									setLoading(true);
									await submitLogout();
									setLoading(false);
								}}
								disabled={loading}
							>
								ログアウト
							</ListItem>
						</ListGroup>
					</>
				)
				: (
					<>
						<ListGroup title={'アカウント'}>
							<ListItem linkTo="/app/login">ログイン</ListItem>
							<ListItem linkTo="/app/register">新規登録</ListItem>
						</ListGroup>
					</>
				)
			}
		</AppWindow>
	);
};
