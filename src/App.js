import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Register from "./Components/Register"
import HomePage from "./Components/Homepage"
import Login from "./Components/Login"
import MainPage from "./Components/MainPage"
import './style.css'
import { useMoralis } from 'react-moralis'
import EditIdentity from './Components/EditIdentity';



function App() {

  // const [todo, setTodos] = useState([])
  const { Moralis, authenticate, isAuthenticated, isAuthenticating, user, account, logout, login } = useMoralis();

  function PrivateRoute() {
    if (isAuthenticated) {
      <Route path="/mainpage">
        <MainPage />
      </Route>
    }
    else
      <Redirect to={{ pathname: "/" }} />

  }


  return (
    <Router>
      <Switch>
        <Route path="/mainpage">
          <MainPage />
        </Route>
        <Route path="/register">
          <Register />
        </Route>

        <Route path="/login">
          <Login />
        </Route>

        <Route path="/">
          <HomePage />
        </Route>
      </Switch>

    </Router >
  );
}

export default App;