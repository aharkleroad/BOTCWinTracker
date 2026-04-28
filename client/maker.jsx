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
    }, []);

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

const handleGameCreate = (e, onGameAdded) => {
    e.preventDefault();
    helper.hideError();

    const script = e.target.querySelector('#script').value;
    let alignStart = e.target.querySelector('#goodAlignment').value;
    const charType = e.target.querySelector('#charType').value;
    const charRole = e.target.querySelector('#charRole').value;
    const alignSwaps = e.target.querySelector('#alignSwaps').value;
    const charSwaps = e.target.querySelector('#charSwaps').value;
    const won = e.target.querySelector('#win').value;

    if (!script || !charType || !charRole || !alignSwaps || !charSwaps || !won) {
        helper.handleError('All fields are required');
        return false;
    }

    const playedDate = e.target.querySelector('#date').value;

    helper.sendPost(e.target.action, { script, alignStart, charType, charRole, alignSwaps, charSwaps, won, playedDate }, onGameAdded);
    return false;
};

const GameList = (props) => {
    const [games, setGames] = useState(props.games);

    // review useEffect
    useEffect(() => {
        const loadGamesFromServer = async () => {
            const response = await fetch('/getGames');
            const data = await response.json();
            setGames(data.games);
        };

        loadGamesFromServer();
    }, [props.reloadGames]);

    if (games.length === 0) {
        return (
            <div className="gameList">
                <h3 className="emptyPage">No Games Yet!</h3>
            </div>
        );
    }

    const gameRecaps = games.map(game => {
        return (
            <div key={game.id} className="game">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="script">Script: {game.script}</h3>
                <h3 className="alignment">Starting Alignment: {game.goodStartAlignment}</h3>
            </div>
        );
    });

    return (
        <div className="gameList">{gameRecaps}</div>
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

    const [chars, setChars] = useState(props.startChars);
    useEffect(() => {
        const getCharType = () => {
            let charType;
            if (document.getElementById('charType').value) {
                charType = document.getElementById('charType').value;
            }
            else {
                charType = props.startChars;
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
            <label htmlFor="charRole">Character Role: </label>
            <select id="charRole" name="charRole" required>
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
        <form id="gameForm" name="gameForm" className="gameForm"
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
                <label htmlFor="goodAlignment">Starting Alignment: </label>
                <select id="goodAlignment" name="goodAlignment" required>
                    <option value="true" selected>Good</option>
                    <option value="false" >Evil</option>
                </select>
            </div>

            <CharacterType triggerCharReload={() => { setReloadCharacters(!reloadCharacters); }} />

            <Role startChars='townsfolk' reloadCharacters={reloadCharacters} />

            <div>
                <label htmlFor="alignSwaps">Number of Alignment Swaps: </label>
                <input type="number" id="alignSwaps" min="0" required />
            </div>

            <div>
                <label htmlFor="charSwaps">Number of Character Changes: </label>
                <input type="number" id="charSwaps" min="0" required />
            </div>

            <div>
                <label htmlFor="win">Did You Win? </label>
                <select id="win" name="win" required>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </select>
            </div>

            <div>
                <label htmlFor="date">Date Played: </label>
                <input id="date" type="date" name="date" />
            </div>

            <input className="makeGameSubmit" type="submit" value="Add Game" />
        </form>
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
    return (<div>Ads!</div>);
}

const App = () => {
    const [reloadGames, setReloadGames] = useState(false);

    return (
        <>
            <NavBar status={false} />

            <div className="mainPageContents">
                <div id="createGame">
                    <GameForm triggerReload={() => setReloadGames(!reloadGames)} />
                </div>
                <div id="games">
                    <GameList games={[]} reloadGames={reloadGames} />
                </div>
                <div id="ads">
                    <Ads status={false}/>
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