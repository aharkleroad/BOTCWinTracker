const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleAccountChange = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost(e.target.action, {});
    return false;
};

const AccountTypeForm = (props) => {
    return (
        <form id="accountForm" name="accountForm" className="accountForm"
            action="/settings" method="POST" onSubmit={(e) => handleAccountChange(e, props.triggerReload)}>
            <DisplayAccountType />
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
            setAccount(data.premiumMember);
        };

        loadAccountFromServer();
    }, [props.reloadAccount]);

    if (setAccount === true) {
        return (
            <>
                <label htmlFor="accountStatusSubmit">Unsubscribe from Premium </label>
                <input id="accountStatusSubmit" className="accountStatusSubmit" type="submit" value="Change Account Type" />
            </>
        );
    }

    return (
        <>
            <label htmlFor="accountStatusSubmit">Go Premium </label>
            <input id="accountStatusSubmit" className="accountStatusSubmit" type="submit" value="Change Account Type" />
        </>
    );
};

const App = () => {
    const [reloadStatus, setReloadStatus] = useState(false);

    return (
        <div>
            <div id="changeAccountStatus">
                <AccountTypeForm triggerReload={() => setReloadStatus(reloadStatus)} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('settings'));
    root.render(<App />);
}

window.onload = init;