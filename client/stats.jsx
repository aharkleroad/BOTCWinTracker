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
            setStatus(data.premiumStatus);
        }

        loadAccountStatus();
    }, [props.reloadNav]);

    return (
        <nav className="navBar">
            <a href="/login"><img id="logo" src="/assets/img/face.png" alt="face logo" /></a>
            <div class="navlink"><a href="/maker">Games</a></div>
            <div class="navlink"><a href="/maker">Stats</a></div>
            {accountStatus && <div class="navlink"><a href="/maker">Friends</a></div>}
            <div class="navlink"><a href="/settings">Settings</a></div>
            <div class="navlink"><a href="/logout">Log out</a></div>
        </nav>
    );
};

const App = () => {
    const [reloadStatus, setReloadStatus] = useState(false);
    const [passChangeStatus, setPassChangeStatus] = useState(undefined);

    return (
        <>
            <NavBar status={true} reloadNav={reloadStatus} />

            <div>
                <h1>Stats!</h1>
            </div>
        </>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('settings'));
    root.render(<App />);
}

window.onload = init;