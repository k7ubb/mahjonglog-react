import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { IndexPage } from './components/Pages/IndexPage';
import { AppIndexPage } from './components/Pages/AppIndexPage';
import { AppLoginPage } from './components/Pages/AppLoginPage';
import { AppRegisterPage } from './components/Pages/AppRegisterPage';
import { AuthProvider } from './usecase/useHandleAuth';

function App() {
	return (
		<AuthProvider>
			<BrowserRouter
				future={{
					v7_startTransition: true,
					v7_relativeSplatPath: true,
				}}
			>
				<Routes>
					<Route path="/" element={<IndexPage />} />
					<Route path="/app" element={<AppIndexPage />} />
					<Route path="/app/login" element={<AppLoginPage />} />
					<Route path="/app/register" element={<AppRegisterPage />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
