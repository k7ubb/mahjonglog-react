import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { IndexPage } from './components/Pages/IndexPage';
import { AppIndexPage } from './components/Pages/AppIndexPage';

function App() {
	return (
		<BrowserRouter
			future={{
				v7_startTransition: true,
				v7_relativeSplatPath: true,
			}}
		>
			<Routes>
				<Route path="/" element={<IndexPage />} />
				<Route path="/app" element={<AppIndexPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
