import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { IndexPage } from './components/Pages/IndexPage';
import { HomePage } from './components/Pages/App/HomePage';
import { LoginPage } from './components/Pages/App/LoginPage';
import { RegisterPage } from './components/Pages/App/RegisterPage';
import { LogAddPage } from './components/Pages/App/LogAddPage';
import { LogListPage } from './components/Pages/App/LogListPage';
import { LogDetailPage } from './components/Pages/App/LogDetailPage';
import { PlayerListPage } from './components/Pages/App/PlayerListPage';
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
					<Route path="/app" element={<HomePage />} />
					<Route path="/app/login" element={<LoginPage />} />
					<Route path="/app/register" element={<RegisterPage />} />
					<Route path="/app/log/add" element={<LogAddPage />} />
					<Route path="/app/log" element={<LogListPage />} />
					<Route path="/app/log/:date" element={<LogDetailPage />} />
					<Route path="/app/player" element={<PlayerListPage />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
