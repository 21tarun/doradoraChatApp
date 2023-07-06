
import './App.css';

import {Route,Routes,Navigate } from 'react-router-dom'

import Start from './components/Start'
import Signup from './components/Signup';
import Chat from './components/Chat'



function App() {
 
  return (
   
    <div className="App">
       
       <Routes>
        <Route  path="/" element={<Navigate replace  to="/chat" />}/>
         
        <Route path='/login' element={<Start />}/>
        <Route path='/signUp' element={<Signup />}/>
        <Route path='/chat' element={<Chat />}/>

      </Routes>
      
    </div>
  );
}

export default App;







