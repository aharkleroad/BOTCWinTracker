import { isUndefined } from 'underscore';

const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// dynamically create nav bar based on the user's account status
const NavBar = (props) => {
    const [accountStatus, setStatus] = useState(props.status);

    useEffect(() => {
        // need to access account status 
        const loadAccountStatus = async () => {
            const response = await fetch('/getAccountType');
            const data = await response.json();
            setStatus(data.premiumMember[0].premiumMember);
        }

        loadAccountStatus();
    }, [props.reloadNav]);

    return (
        <nav className="navBar">
            <a href="/login"><img id="logo" src="/assets/img/BOTCIcon.png" alt="face logo" /></a>
            <div class="navlink"><a href="/maker">Games</a></div>
            <div class="navlink"><a href="/stats">Stats</a></div>
            {accountStatus && <div class="navlink"><a href="/friends">Friends</a></div>}
            <div class="navlink"><a href="/settings">Settings</a></div>
            <div class="navlink"><a href="/logout">Log out</a></div>
        </nav>
    );
};

const handleAccountChange = (e, onAccountChange) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost(e.target.action, {}, onAccountChange);
    return false;
};

const AccountTypeForm = (props) => {
    return (
        <form id="accountForm" name="accountForm" className="accountForm"
            action="/accountSettings" method="POST" onSubmit={(e) => handleAccountChange(e, props.triggerReload)}>
            <DisplayAccountType account={false} reloadAccountDisplay={props.reloadAccountDisplay}/>
        </form>
    );
};

const DisplayAccountType = (props) => {
    const [account, setAccount] = useState(props.account);

    // review useEffect
    useEffect(() => {
        const loadAccountFromServer = async () => {
            const response = await fetch('/getAccountType');
            const data = await response.json();
            setAccount(data.premiumMember[0].premiumMember);
        };

        loadAccountFromServer();
    }, [props.reloadAccountDisplay]);

    if (account === true) {
        return (
            <>
                <p>Premium account</p>
                <input id="accountStatusSubmit" className="accountStatusSubmit" type="submit" value="Unsubscribe from Premium" />
            </>
        );
    }

    return (
        <>
            <p>Basic account</p>
            <p>Switch to premium to get: </p>
            <ul>
                <li>An ad-free experience</li>
                <li>Advanced statistics</li>
                <li>The ability to view your friend's stats</li>
            </ul>
            <input id="accountStatusSubmit" className="accountStatusSubmit" type="submit" value="Go Premium" />
        </>
    );
};

const handlePassChange = (e, onPassChange) => {
    e.preventDefault();
    helper.hideError();

    const currentPass = e.target.querySelector('#currentPass').value;
    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;

    if (!currentPass || !newPass || !newPass2) {
        helper.handleError('All fields are required');
        return false;
    }

    if (newPass !== newPass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {currentPass, newPass, newPass2}, onPassChange);
    return false;
};

const getPassChangeStatus = (status) => {
    console.log(status.status);
    if (!status.status){
        return undefined;
    }
    else if (status.status === 204){
        return true;
    }
    return false;
}

const PassStatus = (props) => {
    if (status) {
        return (
            <div id="passStatusSuccess">
                <p>Your password change was successful!</p>
            </div>
        );
    }
    else if (status === undefined) {
        return (<></>);
    }
    else {
        return (
            <div id="passStatusFailure">
                <p>An error occurred while attempting to set your new password</p>
            </div>
        )
    }
}

const App = () => {
    const [reloadStatus, setReloadStatus] = useState(false);
    const [passChangeStatus, setPassChangeStatus] = useState(undefined);

    return (
        <>
            <NavBar status={false} reloadNav={reloadStatus} />

            <div>
                <div id="changeAccountStatus">
                    <h1>Your Account Status: </h1>
                    <AccountTypeForm triggerReload={() => setReloadStatus(!reloadStatus)} reloadAccountDisplay={reloadStatus}/>
                </div>

                <div id="changePassword">
                    <form id="changePassForm" name="changePassForm" className="changePassForm"
                        action="/passSettings" method="POST" onSubmit={(e) => handlePassChange(e, (passStatus) => {setPassChangeStatus(getPassChangeStatus(passStatus))})}>
                        <h1>Change Your Password: </h1>
                        <div>
                            <label htmlFor="currentPass">Current Password: </label>
                            <input id="currentPass" type="password" />
                        </div>
                        <div>
                            <label htmlFor="newPass">New Password: </label>
                            <input id="newPass" type="password" />
                        </div>
                        <div>
                            <label htmlFor="newPass2">Retype New Password: </label>
                            <input id="newPass2" type="password" />
                        </div>
                        <input className="changePassSubmit" type="submit" value="Change Your Password" />
                    </form>

                    <PassStatus status={passChangeStatus} />
                </div>
            </div>
        </>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('settings'));
    root.render(<App />);
}

window.onload = init;