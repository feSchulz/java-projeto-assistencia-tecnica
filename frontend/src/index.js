import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// <- ADICIONAR estas 2 linhas
import { Provider } from 'react-redux';
import { store } from './store'; // seu store
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* <- ENVOLVER App com Provider */}
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);

reportWebVitals();
