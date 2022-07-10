import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import { Form, Button, FormGroup, Label, Input, Alert } from "reactstrap";
import "./Login.css";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useMoralis } from "react-moralis";


export default function Login() {
    const { Moralis, authenticate, isAuthenticated, isAuthenticating, user, account, logout, login, authError } = useMoralis();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let history = useHistory();

    useEffect(() => {

        if (isAuthenticated) {
            history.push("/homepage");
            history.go("/homepage");

        }
        if (authError) {
            return <Alert>{authError.message}</Alert>
        }
    }, []);


    const handleBackClick = () => {
        console.log("handle is called")
        history.push("/");
        history.go("/");

    }
    const handleCheckLogin = () => {
        console.log(isAuthenticated);
        logout();
        console.log(isAuthenticated);
    }

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    async function handleSubmit(event) {

        event.preventDefault();
        if (Moralis.User.logIn(username, password)) {
            const currentUser = Moralis.User.current();
            if (currentUser) {
                history.push("/mainpage");
                history.go("/mainpage");


            }
            else {

                alert("Error: Invalid username or password");
            }
        }

    }










    return (
        <div className="Login">
            <Form >
                <FormGroup size="lg" >
                    <Label >Username</Label>
                    <Input
                        autoFocus
                        type="user"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </FormGroup>
                <FormGroup size="lg" >
                    <Label>Password </Label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormGroup>
                <Button block size="lg" type="submit" disabled={!validateForm()} onClick={handleSubmit}>
                    Login
                </Button>
            </Form>
            <Button size="lg" onClick={handleBackClick}> Back</Button>
            <br></br>
            <br></br>
            {/* <Button size="lg" onClick={handleCheckLogin}> CheckLoginAndThenLogout</Button> */}
            <Footer>

            </Footer>
        </div>
    );
}