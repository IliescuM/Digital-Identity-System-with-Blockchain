
import React, { useState, useEffect } from 'react'
import { useMoralis, useWeb3Transfer, useMoralisWeb3Api } from 'react-moralis'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, FormGroup, Input, Form, Label } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import { wait } from '@testing-library/user-event/dist/utils';

function TransferEth() {
    // Modal open state
    const [modal, setModal] = React.useState(false);
    const [amount, setAmount] = useState("0");
    const [usdAmount, setUsdAmount] = useState(0);
    const [ethValue, setEthValue] = useState(0);
    const [receiver, setReceiver] = useState("0x");
    const { Moralis, authenticate, isAuthenticated, isAuthenticating, user, account, logout, login, isInitialized } = useMoralis();
    const [balance, setBalance] = useState("0");
    const Web3Api = useMoralisWeb3Api();


    const url = "https://api.coinbase.com/v2/prices/ETH-USD/spot"

    const fetchBalance = async () => {
        const balance = await Web3Api.account.getNativeBalance({ chain: "goerli" });
        const balanceConvert = parseFloat(Moralis.Units.FromWei(balance.balance));
        setBalance(balanceConvert.toFixed(4));
    };
    // Toggle for Modal
    const toggle = () => {
        setModal(!modal);

        const fetchPrice = async () => {
            let curr = 0;

            await fetch(url)
                .then((res) => res.json())
                .then((data) => curr = parseFloat(data.data.amount));

            setEthValue(curr);

        };

        fetchPrice();
        fetchBalance();

    }

    function setUsd(value) {
        setUsdAmount(value)
        setAmount((value / ethValue).toFixed(4))
    }

    function setEth(value) {
        setAmount(value);
        setUsdAmount((value * ethValue).toFixed(4))
    }




    async function HandleSubmit() {
        if (isAuthenticated) {
            const transaction = await Moralis.transfer({ type: "native", amount: Moralis.Units.ETH(amount), receiver: receiver });
            if (await transaction.wait()) {
                alert("Transfer was successfull!");
            }
            else {
                alert("Transfer failed!");
            }
            fetchBalance();

            wait(500)
            setModal(!modal);
        }
    }
    return (
        <div >

            <Button color="secondary" size='lg'
                onClick={toggle}>Send ETH</Button>
            <Modal isOpen={modal}

                toggle={toggle}
                modalTransition={{ timeout: 1000 }}>
                <ModalHeader >Transfer Eth </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup size="lg" >
                            <Label >Current Balance: </Label>
                            <Input
                                autoFocus
                                type="text"
                                value={balance}
                                readOnly={true}
                            />
                        </FormGroup>
                        <FormGroup size="lg" >
                            <Label >Amount (in $USD): </Label>
                            <Input
                                autoFocus
                                type="text"
                                value={usdAmount}
                                onChange={(e) => setUsd(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup size="lg" >
                            <Label >Amount (in $ETH): </Label>
                            <Input
                                autoFocus
                                type="text"
                                value={amount}
                                onChange={(e) => setEth(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup size="lg" >
                            <Label >Send to: </Label>
                            <Input
                                autoFocus
                                type="text"
                                value={receiver}
                                onChange={(e) => setReceiver(e.target.value)}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                    <Button variant="secondary" onClick={HandleSubmit}>
                        Transfer
                    </Button>
                </ModalFooter>
            </Modal>

        </div >
    );
}

export default TransferEth 