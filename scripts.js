let audio = document.querySelector('audio');
let loadingBarInner = document.querySelector('.loadingBar .inner');
let lastIndex = 151;
let overlayInner;
let overlay = document.querySelector('.overlay');
let data, data2;
let allCards = [];
let pokeInfos = [];
let keys = [];
let rotateVal = 0.72;
let scaleFactorX = 1.5;
let rotateAbleCard;

async function loadPokemon () {
    if(localStorage.pokeData) {
        pokeInfos = JSON.parse(localStorage.pokeData);
        lastIndex = pokeInfos.length;
        setCards();
    }else {
        for(let i=1; i<lastIndex+1; i++) {
            data = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            data = await data.json();
            data2 = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${i}`);
            data2 = await data2.json();
            pokeInfos.push([{
                type: data.types[0].type.name,
                name: data.species.name,
                image: data.sprites.front_default,
                noice: data.cries.latest
            }, {
                evolve1: data2.chain.evolves_to[0]
            }]);
            let card = /* HTML */ `
                <div class="imgCont displayFlex" onclick="showInOverlay(${i-1})">
                    <div class="name displayFlex" style="background-color: ${getBgc(data.types[0].type.name)};">
                        <p>#${i}: ${data.species.name.charAt(0).toUpperCase() + data.species.name.slice(1)}</p>
                    </div>
                    <img src="${data.sprites.front_default}" alt="">
                    <p>Type: ${data.types[0].type.name}</p>
                    <div class="playNoice displayFlex" onclick="startPlayer(event, '${data.cries.latest}')">
                        <p>Noice: </p>
                        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="7,5 15,10 7,15" fill="white"/>
                        </svg>
                    </div>
                </div>
            `;
            //pokeInfo.push(card);
            document.querySelector('.allCards').innerHTML += card;
            loadingBar(i);
        }
    }
    for(let i=1; i<lastIndex+1; i++) {
        if(i === lastIndex) {
            localStorage.setItem('pokeData', JSON.stringify(pokeInfos));
        };
    }
}

function setCards(start=0) {
    for(let i=start; i<pokeInfos.length; i++) {
        let card = /* HTML */ `
            <div class="imgCont displayFlex" onclick="showInOverlay(${i})">
                <div class="name displayFlex" style="background-color: ${getBgc(pokeInfos[i][0].type)};">
                    <p>#${i+1}: ${pokeInfos[i][0].name.charAt(0).toUpperCase() + pokeInfos[i][0].name.slice(1)}</p>
                </div>
                <img src="${pokeInfos[i][0].image}" alt="">
                <p>Type: ${pokeInfos[i][0].type}</p>
                <div class="playNoice displayFlex" onclick="startPlayer(event, '${pokeInfos[i][0].noice}')">
                    <p>Noice: </p>
                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="7,5 15,10 7,15" fill="white"/>
                    </svg>
                </div>
            </div>
        `;
        document.querySelector('.allCards').innerHTML += card;
    }
}

function startPlayer(event, link) {
    event.stopPropagation();
    audio.setAttribute('src', link);
    audio.volume = 0.5;
    audio.play();
}

function loadingBar (i) {
    loadingBarInner.style.width = `${100*i/lastIndex}%`;
    if(i === lastIndex) {
        document.querySelector('.loadingBar').classList.add('displayNone');
    }
}

function loadingBarRemaining(i, diff) {
    loadingBarInner.style.width = `${100*(i+1)/diff}%`;
    if(i === diff) {
        document.querySelector('.loadingBar').classList.remove('displayFlex');
        document.querySelector('.loadingBar').classList.add('displayNone');
    }
}

function showInOverlay(i) {
    overlay.classList.remove('displayNone');
    hideAllCards();
    overlay.innerHTML = /* HTML */ `
    <div class="closeOverlay" onclick="closeOverlay()">
        <svg width="20px" height="20px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="20" y1="20" x2="80" y2="80" stroke="black" stroke-width="20" stroke-linecap="round"/>
            <line x1="20" y1="80" x2="80" y2="20" stroke="black" stroke-width="20" stroke-linecap="round"/>
        </svg>
    </div>
    <div class="imgCont rotateAble displayFlex" onclick="checkRotateVal(event)">
        <div class="front displayFlex">
            <div class="name displayFlex" style="background-color: ${getBgc(pokeInfos[i][0].type)};">
                <p>#${i+1}: ${pokeInfos[i][0].name.charAt(0).toUpperCase() + pokeInfos[i][0].name.slice(1)}</p>
            </div>
            <img src="${pokeInfos[i][0].image}" alt="">
            <p>Type: ${pokeInfos[i][0].type}</p>
            <div class="playNoice displayFlex" onclick="startPlayer(event, '${pokeInfos[i][0].noice}')">
                <p>Noice: </p>
                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="7,5 15,10 7,15" fill="white"/>
                </svg>
            </div>
        </div>
        <div class="back displayFlex displayNone" style="transform: scaleX(-1);"></div>
    </div>`;
    rotateAbleCard = document.querySelector('.rotateAble');
}

function closeOverlay() {
    overlay.classList.add('displayNone');
    showAllCards();
}

function hideAllCards() {
    document.querySelector('.allCards').classList.add('displayNone');
}

function showAllCards() {
    document.querySelector('.allCards').classList.remove('displayNone');
}

function showAllPokemon() {
    for(let i=0; i<pokeInfos.length; i++) {
        document.querySelectorAll('.imgCont')[i].classList.remove('displayNone');
    }
}

function getBgc(type) {
    let color = "";
    switch(type) {
        case "bug": {
            color = '#789860';
            break;
        }
        case "dragon": {
            color = '#d5914a';
            break;
        }
        case "electric": {
            color = '#f4dc26';
            break;
        }
        case "fighting": {
            color = '#71797e';
            break;
        }
        case "fire": {
            color = '#aa4203';
            break;
        }
        case "ghost": {
            color = '#00000003';
            break;
        }
        case "grass": {
            color = '#388004';
            break;
        }
        case "ground": {
            color = '#464531';
            break;
        }
        case "rock": {
            color = '#464531';
            break;
        }
        case "poison": {
            color = '#cf9fff';
            break;
        }
        case "psychic": {
            color = '#789860';
            break;
        }
        case "water": {
            color = '#416bdf';
            break;
        }
        case "normal": {
            color = '#808080';
            break;
        }
    }
    return color;
}

function searchCards(event) {
    let input = document.querySelector('#searchAttributes');
    let cards = document.querySelectorAll('.imgCont');
    let val = input.value;
    if(event.key === " ") {
        setKeywords();
    }
    for(let i=0; i<cards.length; i++) {
        if(pokeInfos[i][0].type.includes(val) || pokeInfos[i][0].name.includes(val)) {
            cards[i].classList.remove('displayNone');
        }else {
            cards[i].classList.add('displayNone');
        }
    }
}

function fromTo() {
    let cards = document.querySelectorAll('.imgCont');
    let from = +document.querySelector('#from').value === 0 ? 1 : +document.querySelector('#from').value;
    let to = +document.querySelector('#to').value === 0 ? lastIndex : +document.querySelector('#to').value;
    showAllPokemon();
    if(to - from < 0) {
        return;
    }
    if(to > lastIndex) {
        lastIndex = to;
        loadMissingPokemon(cards.length+1);
    }
    for(let i=0; i<from-1; i++)  {
        cards[i].classList.add('displayNone');
    }
    for(let j=to; j<lastIndex; j++) {
        cards[j].classList.add('displayNone');
    }
}

function setKeywords () {
    let searchVal = document.querySelector('#searchAttributes').value;
    let keyWord = "";
    let extractedKeys = [];
    if(searchVal.includes("  ")) {
        searchVal -= " ";
        if(searchVal == 0) {
            document.querySelector('#searchAttributes').value = "";
        }else {
            document.querySerotatedlector('#searchAttributes').value = searchVal;
        }
    }
    for(let i=0; i<searchVal.length; i++) {
        if(searchVal[i] === " ") {
            extractedKeys.push(keyWord);
            keyWord = "";
        }else {
            keyWord += searchVal[i];
            keys = extractedKeys;
        }
    }
}

async function loadMissingPokemon(indexFirstNew) {
    document.querySelector('.loadingBar').classList.remove('displayNone');
    for(let i=indexFirstNew; i<lastIndex+1; i++) {
        data = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        data = await data.json();
        pokeInfos.push({
            type: data.types[0].type.name,
            name: data.species.name,
            image: data.sprites.front_default,
            noice: data.cries.latest
        });
        let card = /* HTML */ `
            <div class="imgCont displayFlex" onclick="showInOverlay(${i})">
                <div class="name displayFlex" style="background-color: ${getBgc(pokeInfos[i-1].type)};">
                    <p>#${i+1}: ${pokeInfos[i-1].name.charAt(0).toUpperCase() + pokeInfos[i-1].name.slice(1)}</p>
                </div>
                <img src="${pokeInfos[i-1].image}" alt="">
                <p>Type: ${pokeInfos[i-1].type}</p>
                <div class="playNoice displayFlex" onclick="startPlayer(event, '${pokeInfos[i-1].noice}')">
                    <p>Noice: </p>
                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="7,5 15,10 7,15" fill="white"/>
                    </svg>
                </div>
            </div>
        `;
        document.querySelector('.allCards').innerHTML += card;
        loadingBarRemaining(i-indexFirstNew, lastIndex-indexFirstNew);
    }
    updateLocalstorage();
    setCards(indexFirstNew);
}

function updateLocalstorage() {
    localStorage.removeItem('pokeData');
    localStorage.setItem('pokeData', JSON.stringify(pokeInfos));
}

function checkRotateVal(event) {
    event.stopPropagation();
    if(+(rotateVal % 180).toFixed(2) === 0.72) {
        rotateCard(event);
    }else {
        return;
    }
}

function rotateCard() {
    if(rotateVal % 180 === 90) {
        setDisplayFrontBack();
    }else if(rotateVal % 180 === 0 && rotateVal > 0) {
        if(rotateVal === 360) {
            rotateVal = 0;
        }
        rotateVal+=0.72;
        return;
    }
    rotateVal+=0.36;
    rotateVal = +rotateVal.toFixed(2);
    rotateAbleCard.style.transform = `rotateY(${rotateVal}deg) scale(1.5)`;
    setTimeout((event)=>{rotateCard(event);}, 2);
}

function setDisplayFrontBack () {
    if(document.querySelector('.front').classList.contains('displayNone')) {
        document.querySelector('.front').classList.remove('displayNone');
        document.querySelector('.back').classList.add('displayNone');
    }else {
        document.querySelector('.back').classList.remove('displayNone');
        document.querySelector('.front').classList.add('displayNone');
    }
}