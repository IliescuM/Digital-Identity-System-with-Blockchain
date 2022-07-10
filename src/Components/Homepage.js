import React, { useEffect } from 'react'
import { Button, Card, Container, Media, Image } from "reactstrap"
import { useHistory } from 'react-router-dom'
import Footer from './Footer'
import './style.css'
import { useMoralis } from 'react-moralis'

export default function Homepage() {


    let history = useHistory();
    const { Moralis, authenticate, isAuthenticated, isAuthenticating, user, account, logout, login, isInitialized } = useMoralis();

    const handleLoginClick = () => {
        history.push("/login");
        history.go("/login");


    }
    const handleRegisterClick = () => {
        history.push("/register");
        history.go("/register");

    }
    useEffect(() => {
        if (user && isInitialized) {
            history.push("/mainpage");
            history.go("/mainpage");

        }
    });


    return (


        <div className="dashboard">

            <Container className="text-center">
                <br></br>
                <h1 color="white">
                    Digital Identity using
                </h1>
                <h1 >Ethereum Blockchain</h1>
                <br></br>
                <h2>Crypto Wallet </h2>


                <Button variant="primary" className="btn-home" onClick={handleLoginClick} size="lg">Login</Button>
                <Button variant="primary" className="btn-home" onClick={handleRegisterClick} size="lg">Register</Button>

                <br></br>

                <img src={"https://cryptologos.cc/logos/versions/ethereum-eth-logo-full-vertical.svg?v=022"}
                    alt="Logo" height={200} widht={200} />

                
                <Footer />
            </Container>
            

        </div >

    )
}
