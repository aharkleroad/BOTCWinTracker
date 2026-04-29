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

const Ads = (props) => {
    const [accountStatus, setStatus] = useState(props.status);

    useEffect(() => {
        // need to access account status 
        const loadAccountStatus = async () => {
            const response = await fetch('/getAccountType');
            const data = await response.json();
            setStatus(data.premiumMember[0].premiumMember);
        }

        loadAccountStatus();
    }, []);

    if (accountStatus) return (<></>);
    return (
        <>
            <img src="/assets/img/placeholderAd.png" alt="ad" className="ad" width="400px" />
            <img src="/assets/img/placeholderAd.png" alt="ad" className="ad" width="400px" />
        </>
    );
}

const App = () => {
    const [reloadStatus, setReloadStatus] = useState(false);
    const [passChangeStatus, setPassChangeStatus] = useState(undefined);

    return (
        <>
            <NavBar status={true} reloadNav={reloadStatus} />

            <div>
                <h1>Stats!</h1>
            </div>
            <div id="ads">
                <Ads status={false} />
            </div>
        </>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}

window.onload = init;