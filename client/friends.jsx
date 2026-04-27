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
            <div class="navlink"><a href="/maker">Friends</a></div>
            <div class="navlink"><a href="/settings">Settings</a></div>
            <div class="navlink"><a href="/logout">Log out</a></div>
        </nav>
    );
};

const handleFriendCreate = (e, onFriendAdded) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#usernameField').value;

    if (!username) {
        helper.handleError('Username required');
        return false;
    }

    helper.sendPost(e.target.action, { username }, onFriendAdded);
    return false;
};

const FriendForm = (props) => {
    const [reloadCharacters, setReloadCharacters] = useState(false);

    return (
        <form id="friendForm" name="friendForm" className="friendForm"
            action="/friends" method="POST" onSubmit={(e) => handleFriendCreate(e, props.triggerReload)}>

            <div>
                <label htmlFor="username">Username: </label>
                <input type='text' id="username" placeholder="Friend's username"/>
            </div>

            <input className="makeFriendSubmit" type="submit" value="Add Friend" />
        </form>
    );
}

const FriendList = (props) => {
    const [friends, setFriends] = useState(props.friends);

    useEffect(() => {
        const loadFriendsFromServer = async () => {
            const response = await fetch('/getFriends');
            const data = await response.json();
            setFriends(data.friends);
        };

        loadFriendsFromServer();
    }, [props.reloadFriends]);

    if (friends.length === 0) {
        return (
            <div className="friendList">
                <h3 className="emptyPage">No Friends Yet!</h3>
            </div>
        );
    }

    const friendStats = friends.map(friend => {
        return (
            <div key={friend.username} className="friend">
                <h3 className="username">{friend.username}</h3>
            </div>
        );
    });

    return (
        <div className="friendList">{friendStats}</div>
    );
};

const App = () => {
    const [reloadFriends, setReloadFriends] = useState(false);

    return (
        <>
            <NavBar status={reloadStatus} />

            <div className="mainPageContents">
                <div id="addFriends">
                    <h1>Add Friends:</h1>
                    <FriendForm triggerReload={() => setReloadFriends(!reloadFriends)} />
                </div>
                <div id="friendList">
                    <FriendList friends={[]} reloadFriends={reloadFriends} />
                </div>
            </div>
        </>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}

window.onload = init;