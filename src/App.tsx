import './App.css';
import RouteConfig from './route';
import { useReducer, createContext } from 'react'
import { HashRouter } from 'react-router-dom';
import { Context } from './utils/types';
import { defaultContext, defaultState, defaultStateInit, initState } from './reducer';

export const PNft = createContext<Context>(defaultContext);

function App() {
  const [state, dispatch] = useReducer(initState, defaultState, defaultStateInit);
  return (
    <HashRouter>
      <PNft.Provider value={{ state, dispatch }}>
        <div className='App'>
          <RouteConfig />
        </div>
      </PNft.Provider>
    </HashRouter>
  );
}

export default App;
