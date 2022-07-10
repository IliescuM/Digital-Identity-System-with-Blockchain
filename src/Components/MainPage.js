import { React, useState, useEffect } from 'react'
import { Button, Card, Container, Media, Image } from "reactstrap"
import { useHistory } from 'react-router-dom'
import Footer from './Footer'
import './style.css'
import { useMoralis, useMoralisWeb3Api, useERC20Balances } from 'react-moralis'
import GraphEth from './GraphEth'
import TransferEth from './TransferEth'
import EditIdentity from './EditIdentity'

export default function MainPage() {
    let history = useHistory();


    const { Moralis, authenticate, isAuthenticated, isAuthenticating, isInitialized, user, account, logout, login } = useMoralis();
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState("0");
    const Web3Api = useMoralisWeb3Api();





    const fetchBalance = async () => {
        const balance = await Web3Api.account.getNativeBalance({ chain: "goerli" });
        const balanceConvert = parseFloat(Moralis.Units.FromWei(balance.balance));
        setBalance(balanceConvert.toFixed(4));

    };

    setInterval(function () {
        fetchBalance()
    }, 30000)


    useEffect(() => {
        if (isInitialized || user) {
            fetchBalance();
        }
        fetchBalance();




    }, []);

    async function logOut() {
        await Moralis.User.logOut();
        console.log("logged out");
        handleLogout();
    }
    const handleLogout = () => {

        history.push('/');
        history.go('/');


        console.log("handle logout is called")

    }
    const handleUserName = () => {
        if (user) {
            return user.getUsername();
        }


    }
    const showBalance = () => {
        return balance;
    }
    const showAddressUser = () => {
        if (user) {

            return user.get("accounts");

        }
    }
    const addWallet = async () => {
        const web3 = await Moralis.enableWeb3()
        const currentAccount = web3.provider.selectedAddress
        try {
            await Moralis.link(currentAccount, { signingMessage: `Link wallet to your account` })
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='body'>



            <br></br>
            <h1 className='text-center'>Welcome {handleUserName()} !</h1>
            <br></br>
            <h2 className='text-center'>EthAdress: {showAddressUser()}</h2>
            <br></br>
            <h2 className='text-center'>Balance: {balance} ETH </h2>

            <div className='btn-group-vertical'>
                <div className="btn-group-vertical" role="group" aria-label="...">
                    <Button size="lg" variant="primary" onClick={logOut} >Logout</Button>{' '}
                    <br></br>
                    <Button size="lg" variant="primary" onClick={addWallet} >Add Wallet (MetaMask)</Button>{' '}
                    <br></br>
                    <Button size="lg" variant="primary" onClick={fetchBalance} >Refresh Balance</Button>{' '}
                    <EditIdentity></EditIdentity>
                    <br></br>
                    <TransferEth></TransferEth>

                </div>
            </div>

            <div className="graphContainer">
                <Container className="graphContainer">

                    <GraphEth></GraphEth>
                </Container>
            </div>
            <br></br>


            <Footer fluid>

            </Footer>


        </div>
    );
}
