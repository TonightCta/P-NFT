import './App.scss';
import RouteConfig from './route';
import { useReducer, createContext, useEffect } from 'react'
import { HashRouter } from 'react-router-dom';
import { Context } from './utils/types';
import { defaultContext, defaultState, defaultStateInit, initState } from './reducer';
import { VERSION } from './utils/source';
import './utils/connect/walletconnect'

export const PNft = createContext<Context>(defaultContext);

export const App = () => {
  const [state, dispatch] = useReducer(initState, defaultState, defaultStateInit);
  useEffect(() => {
    const obj: any = window.sessionStorage;
    let size: number = 0;
    for (let item in obj) {
      if (obj.hasOwnProperty(item)) {
        size += obj.getItem(item).length;
      }
    };
    console.log('Currently used storage:' + (size / 1024).toFixed(2) + 'KB');
  }, [])
  return (
    <HashRouter>
      <PNft.Provider value={{ state, dispatch }}>
        <div className={`App ${VERSION === 'new' ? 'new-app' : 'old-app'}`}>
          <RouteConfig />
        </div>
      </PNft.Provider>
    </HashRouter>
  );
}

// export default App;
