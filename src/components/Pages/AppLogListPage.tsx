import { useHandleUser } from '../../usecase/useHandleUser';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';

export const AppLogListPage: React.FC = () => {
	const { user } = useHandleUser();
	return (
		<AppWindow title="ログ一覧" backTo="/app" authOnly={true}>
			<ListGroup title={`${user?.accountName}さん`}>
				<ListItem>a</ListItem>
				<ListItem>b</ListItem>
				<ListItem>c</ListItem>
			</ListGroup>
		</AppWindow>
	);
};
