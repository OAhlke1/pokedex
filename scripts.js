let audio = document.querySelector('audio');
let loadingBarInner = document.querySelector('.loadingBar .inner');
let lastIndex = 151;
let overlayInner;
let overlay = document.querySelector('.overlay');
let data;
let allCards = [];
let pokeInfos = [];

async function loadPokeImages () {
    if(localStorage.pokeData) {
        pokeInfos = JSON.parse(localStorage.pokeData);
        setCards();
    }else {
        for(let i=1; i<lastIndex+1; i++) {
            data = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            data = await data.json();
            pokeInfos.push({
                type: data.types[0].type.name,
                name: data.species.name,
                image: data.sprites.front_default,
                noice: data.cries.latest
            });
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

function setCards() {
    for(let i=0; i<pokeInfos.length; i++) {
        let card = /* HTML */ `
            <div class="imgCont displayFlex" onclick="showInOverlay(${i})">
                <div class="name displayFlex" style="background-color: ${getBgc(pokeInfos[i].type)};">
                    <p>#${i+1}: ${pokeInfos[i].name.charAt(0).toUpperCase() + pokeInfos[i].name.slice(1)}</p>
                </div>
                <img src="${pokeInfos[i].image}" alt="">
                <p>Type: ${pokeInfos[i].type}</p>
                <div class="playNoice displayFlex" onclick="startPlayer(event, '${pokeInfos[i].noice}')">
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
        document.querySelector('.loadingBar').classList.remove('displayFlex');
        document.querySelector('.loadingBar').classList.add('displayNone');
    }
}

function showInOverlay(i) {
    overlay.classList.remove('displayNone');
    overlay.classList.add('displayFlex');
    hideAllCards();
    overlay.innerHTML = /* HTML */ `
    <div class="imgCont displayFlex" onclick="showInOverlay(${i})">
        <div class="name displayFlex" style="background-color: ${getBgc(pokeInfos[i].type)};">
            <p>#${i+1}: ${pokeInfos[i].name.charAt(0).toUpperCase() + pokeInfos[i].name.slice(1)}</p>
        </div>
        <img src="${pokeInfos[i].image}" alt="">
        <p>Type: ${pokeInfos[i].type}</p>
        <div class="playNoice displayFlex" onclick="startPlayer(event, '${pokeInfos[i].noice}')">
            <p>Noice: </p>
            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <polygon points="7,5 15,10 7,15" fill="white"/>
            </svg>
        </div>
    </div>
`;
}

function closeOverlay() {
    overlay.classList.remove('displayFlex');
    overlay.classList.add('displayNone');
    showAllCards();
}

function hideAllCards() {
    document.querySelector('.allCards').classList.remove('displayFlex');
    document.querySelector('.allCards').classList.add('displayNone');
}

function showAllCards() {
    document.querySelector('.allCards').classList.add('displayFlex');
    document.querySelector('.allCards').classList.remove('displayNone');
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

function searchCards() {
    let input = document.querySelector('#searchAttributes');
    let val = input.value;
    for(let i=0; i<pokeInfos.length; i++) {
        if(pokeInfos[i].type.includes(val) || pokeInfos[i].name.includes(val)) {
            document.querySelectorAll('.imgCont')[i].classList.add('displayFlex');
            document.querySelectorAll('.imgCont')[i].classList.remove('displayNone');
        }else {
            document.querySelectorAll('.imgCont')[i].classList.remove('displayFlex');
            document.querySelectorAll('.imgCont')[i].classList.add('displayNone');
        }
    }
}

function fromTo() {
    let cards = document.querySelectorAll('.imgCont');
    let from = +document.querySelector('#from').value === 0 ? 0 : +document.querySelector('#from').value;
    let to = +document.querySelector('#to').value === 0 ? lastIndex : +document.querySelector('#to').value;
    let diff = to - from; 
    showAllCards();
    switch(diff) {
        case -1: {
            return;
        }
    }
    for(let i=0; i<from-1; i++)  {
        cards[i].classList.add('displayNone');
    }
    for(let j=to; j<lastIndex; j++) {
        cards[j].classList.add('displayNone');
    }
}