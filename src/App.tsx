import { pageComponents, PageProvider, useNavigation } from './components/contexts/PageContext';
import { AuthProvider } from './usecase/useHandleUser';
import { LogProvider } from './usecase/useHandleLog';

const PageConponent = () => {
	const { currentPage } = useNavigation();
	const { component: Component } = pageComponents[currentPage.type];
	const { type, ...props } = currentPage as any;
	
	return <Component {...props} />;
};

function App() {
	return (
		<AuthProvider>
			<LogProvider>
				<PageProvider>
					<PageConponent />
				</PageProvider>
			</LogProvider>
		</AuthProvider>
	);
}

export default App;
