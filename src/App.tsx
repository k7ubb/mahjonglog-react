import { pageComponents, PageProvider, useNavigation } from './components/contexts/PageContext';
import { LogProvider } from './usecase/useHandleLog';
import { AuthProvider } from './usecase/useHandleUser';

const PageConponent = () => {
	const { currentPage } = useNavigation();
	const { component: Component } = pageComponents[currentPage.type];
	const { type: _, ...props } = currentPage as any;
	
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
