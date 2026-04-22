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
            const data = { premiumStatus: true };
            // const response = await fetch('/getDomos');
            // const data = await response.json();
            setStatus(data.premiumStatus);
        }

        loadAccountStatus();
    }, [props.reloadNav]);

    // premium bar
    if (accountStatus) {
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
    }
    // basic bar
    return (
        <nav className="navBar">
            <a href="/login"><img id="logo" src="/assets/img/face.png" alt="face logo" /></a>
            <div class="navlink"><a href="/maker">Games</a></div>
            <div class="navlink"><a href="/maker">Stats</a></div>
            <div class="navlink"><a href="/settings">Settings</a></div>
            <div class="navlink"><a href="/logout">Log out</a></div>
        </nav>
    );
};

const handleGameCreate = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;

    if (!name || !age) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, age }, onDomoAdded)
    return false;
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    // review useEffect
    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };

        loadDomosFromServer();
    }, [props.reloadGames]);

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo.id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">{domoNodes}</div>
    );
};

const Role = (props) => {
    const allChars = {
        townsfolk: [{ name: "Grandmother" }, { name: "Fortune Teller" }, { name: "Monk" }],
        outsiders: [{ name: "Mutant" }, { name: "Recluse" }, { name: "Plague Doctor" }],
        minions: [{ name: "Scarlet Woman" }, { name: "Poisoner" }, { name: "Goblin" }],
        demons: [{ name: "Imp" }, { name: "Fangu" }, { name: "Lleech" }],
        travellers: [{ name: "Harlot" }, { name: "Scapegoat" }],
    };

    const [chars, setChars] = useState(props.roleType);
    useEffect(() => {
        const getCharType = () => {
            let charType;
            if (document.getElementById('charType').value) {
                charType = document.getElementById('charType').value;
            }
            else {
                charType = props.roleType;
            }
            setChars(charType);
        };
        getCharType();
    }, [props.reloadCharacters]);

    const charList = allChars[chars].map(char => {
        return (
            <option key={char.name} className="char">{char.name}</option>
        );
    });

    return (
        <div>
            <label htmlFor="charType">Character Type: </label>
            <select id="charType" name="charType" required>
                <div className="charList">{charList}</div>
            </select>
        </div>
    );
}

const CharacterType = (props) => {
    return (
        <div>
            <label htmlFor="charType">Character Type: </label>
            <select id="charType" name="charType" onInput={props.triggerCharReload} required>
                <option value="townsfolk" selected>Townsfolk</option>
                <option value="outsiders">Outsider</option>
                <option value="minions">Minion</option>
                <option value="demons">Demon</option>
                <option value="travellers">Traveller</option>
            </select>
        </div>
    );
};

const GameForm = (props) => {
    const [reloadCharacters, setReloadCharacters] = useState(false);

    return (
        <form id="domoForm" name="domoForm" className="domoForm"
            action="/maker" method="POST" onSubmit={(e) => handleGameCreate(e, props.triggerReload)}>

            <div>
                <label htmlFor="script">Script: </label>
                <select id="script" name="script" required>
                    <option value="trouble" selected>Trouble Brewing</option>
                    <option value="sects">Sects and Violets</option>
                    <option value="badMoon">Bad Moon Rising</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div>
                <label htmlFor="alignment">Starting Alignment: </label>
                <select id="alignment" name="alignment" required>
                    <option value="good" selected>Good</option>
                    <option value="evil">Evil</option>
                </select>
            </div>

            <CharacterType triggerCharReload={() => { setReloadCharacters(!reloadCharacters); }} />

            <Role roleType='townsfolk' reloadCharacters={reloadCharacters} />

            <label htmlFor="date">Date Played: </label>
            <input id="date" type="datetime-local" name="date" />

            <input className="makeDomoSubmit" type="submit" value="Add Game" />
        </form>
    );
};

const App = () => {
    const [reloadGames, setReloadGames] = useState(false);

    return (
        <>
            <NavBar reloadNav={false} />

            <div className="mainPageContents">
                <div id="createGame">
                    <GameForm triggerReload={() => setReloadGames(!reloadGames)} />
                </div>
                <div id="domos">
                    <DomoList domos={[]} reloadDomos={reloadGames} />
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