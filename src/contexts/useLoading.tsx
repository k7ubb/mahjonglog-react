import { useState, createContext, useContext, type ReactNode } from 'react';
import ReactLoading from 'react-loading';

const LoadingContext = createContext<{
	loading: boolean;
	startLoading: () => void;
	endLoading: () => void;
		}>({
			loading: true,
			startLoading: () => {},
			endLoading: () => {},
		});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
	const [loading, setLoading] = useState(false);

	return (
		<LoadingContext.Provider
			value={{
				loading,
				startLoading: () => setLoading(true),
				endLoading: () => setLoading(false)
			}}>
			{children}
			<div className={`
				absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
				${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
			`}>
				<ReactLoading type='spin' color='#999999' />
			</div>
		</LoadingContext.Provider>
	);
};

export const useLoading = () => useContext(LoadingContext);
