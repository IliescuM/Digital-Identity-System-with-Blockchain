import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MoralisProvider } from 'react-moralis';


const root = ReactDOM.createRoot(document.getElementById('root'));
document.body.style.overflow = "hidden"

console.log(process.env.REACT_APP_SERVERURL)

root.render(

  <MoralisProvider serverUrl={process.env.REACT_APP_SERVERURL}
    appId={process.env.REACT_APP_APPID}>
    <App />
  </MoralisProvider>



);
