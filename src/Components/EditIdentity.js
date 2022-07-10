import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, FormGroup, Input, Form, Label, Alert } from 'reactstrap';
import { useMoralis, useWeb3ExecuteFunction, } from 'react-moralis'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import "./style.css";

function EditIdentity() {
    const { Moralis, authenticate, isAuthenticated, isAuthenticating, user, account, logout, isInitialized, isWeb3Enabled, enableWeb3 } = useMoralis();
    // const currentUser = Moralis.User.current();
    // console.log(currentUser)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const { save } = useNewMoralisObject("_User");
    const contractProcessor = useWeb3ExecuteFunction();


    const [modal, setModal] = React.useState(false);
    const [email, setEmail] = useState("");
    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [cnp, setcnp] = useState("");
    const [encrypemail, setencrypEmail] = useState("");
    const [encrypfirstname, setencrypfirstname] = useState("");
    const [encryplastname, setencryplastname] = useState("");
    const [encrypcnp, setencrypcnp] = useState("");

    function encryptUser() {
        var CryptoJS = require("crypto-js");
        const secret = cnp;
        const tempencrypt = CryptoJS.AES.encrypt(email, secret).toString();
        setencrypEmail(tempencrypt);
        const tempencrypt2 = CryptoJS.AES.encrypt(firstname, secret).toString();
        setencrypfirstname(tempencrypt2);
        const tempencrypt3 = CryptoJS.AES.encrypt(lastname, secret).toString();;
        setencryplastname(tempencrypt3);
        const tempencrypt4 = CryptoJS.AES.encrypt(cnp, secret).toString();
        setencrypcnp(tempencrypt4);
    }



    //  currentUser.get("email")




    const toggle = () => setModal(!modal);


    async function fetchUser() {
        const currentUser = Moralis.User.current();
        setEmail(currentUser.get("email"));
        setfirstname(currentUser.get("firstName"));
        setlastname(currentUser.get("lastName"));
        setcnp(currentUser.get("cnp"));
        encryptUser()

    }

    async function deployIdentity() {
        console.log(isWeb3Enabled, isAuthenticated)
        let options = {
            contractAddress: "0xf598Dc119500Dc540390753C93CFB9de6b4ba337",
            functionName: "setUserI",
            abi: [{ "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }], "name": "getUserI", "outputs": [{ "internalType": "string", "name": "_firstName", "type": "string" }, { "internalType": "string", "name": "_lastName", "type": "string" }, { "internalType": "string", "name": "_email", "type": "string" }, { "internalType": "string", "name": "_CNP", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_firstName", "type": "string" }, { "internalType": "string", "name": "_lastName", "type": "string" }, { "internalType": "string", "name": "_email", "type": "string" }, { "internalType": "string", "name": "_CNP", "type": "string" }], "name": "setUserI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }],
            params: {
                _firstName: encrypfirstname,
                _lastName: encryplastname,
                _email: encrypemail,
                _CNP: encrypcnp
            },

        }
        const transaction = await Moralis.executeFunction(options);
        if (await transaction.wait()) {
            alert("Identity was deployed!");
        }
        else {
            alert("Identity deployment failed!");
        }
        // await contractProcessor.fetch({
        //     params: options,
        //     onSuccess: () => {
        //         console.log("Success");
        //     },
        //     onEror: (error) => {
        //         console.log(error);
        //     },
        // });
    }
    function handleFirstNameChange(event) {
        setfirstname(event.target.value);
    }
    function handleLastNameChange(event) {
        setlastname(event.target.value);
    }
    function handleCnpChange(event) {
        setcnp(event.target.value);
    }
    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    const updateProfile = async () => {
        const currentUser = Moralis.User.current();
        // const data = {
        //     cnp: cnp,
        //     lastName: lastname,
        //     firstName: firstname,
        //     email: email
        // };
        try {
            currentUser.set("email", String(email));
            currentUser.set("cnp", String(cnp));
            currentUser.set("lastName", String(lastname));
            currentUser.set("firstName", String(firstname));
            if (await currentUser.save()) {

                alert("Profile was updated!")

            }

        }
        catch (e) {
            alert("Profile was not updated!\n" + "Error: " + e.code + " " + e.message);
        }

    };
    useEffect(() => {
        if (!isWeb3Enabled && isAuthenticated) {
            enableWeb3();
        }


    }, [isWeb3Enabled, isAuthenticated]);


    useEffect(() => {
        if (isInitialized || isAuthenticated || user) {
            fetchUser();
        }


    }, []);

    return (
        <div >
            <div className="btn-group-vertical" role="group" aria-label="...">
                <br></br>
                <Button color="secondary" size='lg'
                    onClick={function (event) { toggle(); fetchUser() }}>Edit Profile</Button>
            </div>

            <Modal isOpen={modal}

                toggle={toggle}
                modalTransition={{ timeout: 1000 }}>
                <ModalHeader >Edit Profile </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup size="lg" >
                            <Label >Email: </Label>
                            <Input
                                autoFocus
                                type="text"
                                value={email}
                                onChange={handleEmailChange}

                            />
                        </FormGroup>
                        <FormGroup size="lg" >
                            <Label >First Name: </Label>
                            <Input
                                autoFocus
                                type="text"
                                value={firstname}
                                onChange={handleFirstNameChange}


                            />
                        </FormGroup>
                        <FormGroup size="lg" >
                            <Label >Last Name: </Label>
                            <Input
                                autoFocus
                                type="text"
                                value={lastname}
                                onChange={handleLastNameChange}



                            />
                        </FormGroup>
                        <FormGroup size="lg" >
                            <Label >CNP: </Label>
                            <Input
                                autoFocus
                                type="text"
                                value={cnp}
                                onChange={handleCnpChange}



                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={toggle}>
                        Close
                    </Button>
                    <Button variant="secondary" onClick={updateProfile}>
                        Update Profile
                    </Button>
                    <Button variant="secondary" onClick={deployIdentity}>
                        Deploy Identity
                    </Button>
                </ModalFooter>
            </Modal>

        </div>
    )
}

export default EditIdentity