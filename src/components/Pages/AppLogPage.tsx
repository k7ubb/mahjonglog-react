import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';
import { useHandleUser } from '../../usecase/useHandleUser';

export const AppLogPage: React.FC = () => {
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
