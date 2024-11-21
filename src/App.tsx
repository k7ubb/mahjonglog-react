import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { IndexPage } from './components/Pages/IndexPage';
import { HomePage } from './components/Pages/HomePage';
import { LoginPage } from './components/Pages/LoginPage';
import { RegisterPage } from './components/Pages/RegisterPage';
import { LogAddPage } from './components/Pages/LogAddPage';
import { LogListPage } from './components/Pages/LogListPage';
import { LogDetailPage } from './components/Pages/LogDetailPage';
import { PlayerListPage } from './components/Pages/PlayerListPage';
import { PersonalScorePage } from './components/Pages/PersonalScorePage';
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
					<Route path="/app/player/:player" element={<PersonalScorePage />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
