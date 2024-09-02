import React from 'react';
import Home from './components/Home';
import './styles/global.css';


const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header"></header>
      <div className='container-home'>
        <Home />
      </div>
    </div>
  );

}

export default App;
