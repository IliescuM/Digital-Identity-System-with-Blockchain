
import './style.css'
import Footer from './Footer'
import { Container } from 'reactstrap'
import React, { useEffect, useState } from 'react'
import { Form, Button, FormGroup, Label, Input } from "reactstrap";
import "./Login.css";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useMoralis } from "react-moralis";


export default function Register() {
    const { Moralis, authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");
    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [cnp, setcnp] = useState("")
    let history = useHistory();

    // useEffect(() => {
    //     if (user) {
    //         history.push("/homepage");
    //         history.go("/homepage");

    //     }
    // }, []);


    const handleBackClick = () => {
        console.log("handle is called")
        history.push("/");
        history.go("/");


    }
    const handleCheckLogin = () => {
        console.log(isAuthenticated);
        logout();
    }
    async function handleRegister() {
        console.log("handle is called");
        const user = new Moralis.User();
        user.set("username", username);
        user.set("email", email);
        user.set("password", password);
        user.set("firstName", firstname);
        user.set("lastName", lastname);
        user.set("cnp", cnp);
        try {
            await user.signUp();
            console.log(user);

            const currentUser = Moralis.User.current();
            if (currentUser) {
                history.push("/mainpage");
                history.go("/mainpage");
            }
        }
        catch (e) {
            alert("Error: " + e.code + " " + e.message);
        }
    }


    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        handleRegister();
    }

    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
                <FormGroup size="lg">
                    <Label >Username</Label>
                    <Input
                        autoFocus
                        type="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Label >Email</Label>
                    <Input
                        autoFocus
                        type="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormGroup>
                <FormGroup size="lg" >
                    <Label >First Name</Label>
                    <Input
                        autoFocus
                        type="text"
                        value={firstname}
                        onChange={(e) => setfirstname(e.target.value)}
                    />
                </FormGroup>
                <FormGroup size="lg" >
                    <Label >Last Name</Label>
                    <Input
                        autoFocus
                        type="text"
                        value={lastname}
                        onChange={(e) => setlastname(e.target.value)}
                    />
                </FormGroup>
                <FormGroup size="lg" >
                    <Label >CNP</Label>
                    <Input
                        autoFocus
                        type="text"
                        value={cnp}
                        onChange={(e) => setcnp(e.target.value)}
                    />
                </FormGroup>

                <FormGroup size="lg" >
                    <Label>Password - Private Key</Label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormGroup>
                <Button block size="lg" type="submit" disabled={!validateForm()} >
                    Register
                </Button>
            </Form>
            <Button size="lg" onClick={handleBackClick}> Back</Button>
            <br></br>
            <br></br>
            {/* <Button size="lg" onClick={handleCheckLogin}> CheckLoginAndThenLogout</Button> */}

            <Footer>

            </Footer>
        </div>
    )
}
