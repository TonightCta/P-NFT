import './App.scss';
import RouteConfig from './route';
import { useReducer, createContext } from 'react'
import { BrowserRouter } from 'react-router-dom';
import { Context } from './utils/types';
import { defaultContext, defaultState, defaultStateInit, initState } from './reducer';

export const PNft = createContext<Context>(defaultContext);

function App() {
  const [state, dispatch] = useReducer(initState, defaultState, defaultStateInit);
  return (
    <BrowserRouter>
      <PNft.Provider value={{ state, dispatch }}>
        <div className='App'>
          <RouteConfig />
        </div>
      </PNft.Provider>
    </BrowserRouter>
  );
}

export default App;
