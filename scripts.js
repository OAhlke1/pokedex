let audio = document.querySelector('audio');
let loadingBarInner = document.querySelector('.loadingBar .inner');
let lastIndex = 151;
let overlayInner;
let overlay = document.querySelector('.overlay');
let data;
let allCards = [];

async function loadPokeImages () {
    if(localStorage.pokeData) {
        allCards = JSON.parse(localStorage.pokeData);
        for(let i=0; i<allCards.length; i++) {
            document.querySelector('.allCards').innerHTML += allCards[i];
        }
    }else {
        for(let i=1; i<lastIndex+1; i++) {
            data = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            data = await data.json();
            let card = /* HTML */ `
                <div class="imgCont displayFlex" onclick="showInOverlay(${i-1})" poketype="${data.types[0].type.name}">
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
            allCards.push(card);
            document.querySelector('.allCards').innerHTML += card;
            loadingBar(i);
            if(i === lastIndex) {
                localStorage.setItem('pokeData', JSON.stringify(allCards));
            }
        };
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
    overlay.innerHTML = allCards[i];
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