import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { IndexPage } from './components/Pages/IndexPage';
import { AppIndexPage } from './components/Pages/AppIndexPage';
import { AppLoginPage } from './components/Pages/AppLoginPage';
import { AppRegisterPage } from './components/Pages/AppRegisterPage';
import { AppLogAddPage } from  './components/Pages/AppLogAddPage';
import { AppLogListPage } from  './components/Pages/AppLogListPage';
import { AppPlayerListPage } from  './components/Pages/AppPlayerListPage';
import { AuthProvider } from './usecase/useHandleUser';

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
					<Route path="/app/log/add" element={<AppLogAddPage />} />
					<Route path="/app/log" element={<AppLogListPage />} />
					<Route path="/app/player" element={<AppPlayerListPage />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
