let audio = document.querySelector('audio');
let loadingBarInner = document.querySelector('.loadingBar .inner');
let lastIndex = 151;
let overlayInner;
let overlay = document.querySelector('.overlay');
let data, data2;
let allCards = [];
let pokeInfos = [];
let keys = [];
let rotateVal = 1.44;
let scaleFactorX = 1.5;
let rotateAbleCard;
let evoData;
let evoChain;
let pokeCount = 0;
let pokeCountArrays = [];
let evoChainIndexes = [];
let evosHtmlArr = [];
let name = "";
let slidePerce = 0;

let cK = function checkKeywords(words, i) {
    let name = pokeInfos[i].name;
    let type = pokeInfos[i].type;
    return name.includes(words.name) || type.includes(words.type);
}

async function loadPokemon () {
    console.log(document.querySelectorAll('.overlay').length);
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
            pokeInfos.push({
                type: data.types[0].type.name,
                name: data.species.name,
                image: data.sprites.front_default,
                noice: data.cries.latest,
                hp: data.stats[0].base_stat,
                attack: data.stats[1].base_stat,
                defense: data.stats[2].base_stat,
                specialAttack: data.stats[3].base_stat,
                specialDefense: data.stats[4].base_stat,
                speed: data.stats[5].base_stat
            });
            //pokeInfo.push(card);
            document.querySelector('.allCards').innerHTML += setCard(i-1);
            loadingBar(i);
            window.scrollTo(0, document.body.scrollHeight);
        }
    }
    for(let i=1; i<lastIndex+1; i++) {
        if(i === lastIndex) {
            localStorage.setItem('pokeData', JSON.stringify(pokeInfos));
        };
    }
    loadEvolutions();
}

async function loadEvolutions() {
    for(let i=0; i<lastIndex; i++) {
        evoData = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${i+1}`);
        evoData = await evoData.json();
        checkForProperty(evoData.chain);
    }
    pushEvosToPokeInfos();
}

function checkForProperty(elem) {
    pokeCount++;
    evoChainIndexes.push(pokeCount);
    if(elem.hasOwnProperty('evolves_to')) {
        checkForProperty(elem["evolves_to"]);
    }else {
        pokeCountArrays.push(evoChainIndexes);
        evoChainIndexes = [];
        return;
    }
}

function pushEvosToPokeInfos() {
    for(let i=0; i<pokeCountArrays.length; i++) {
        for(let j=0; j<pokeCountArrays[i].length; j++) {
            if(pokeCountArrays[i][j] === lastIndex+1) {
                setEvolutions();
                return;
            }else {
                pokeInfos[pokeCountArrays[i][j]-1].evolutions = pokeCountArrays[i];
            }
        }
    }
    updateLocalstorage();
}

function setEvolutions() {
    let evos = "";
    for(let i=0; i<pokeInfos.length; i++) {
        if(i === pokeInfos.length-1) {
            break;
        }
        for(let j=0; j<pokeInfos[i].evolutions.length; j++) {
            evos += /* HTML */ `
                <div class="evo">
                    <img src="${pokeInfos[pokeInfos[i].evolutions[j]-1].image}" alt="${pokeInfos[pokeInfos[i].evolutions[j]-1].name}">
                    <p>${pokeInfos[pokeInfos[i].evolutions[j]-1].name}</p>
                </div>
            `;
        }
        document.querySelectorAll('.imgCont .back .evolutions')[i].innerHTML = evos;
        evosHtmlArr.push(evos);
        evos = "";
        pokeInfos[i].evolutionsAsHtml = evos;
    }
}

function setCard(i) {
    return /* HTML */  `<div class="imgCont displayFlex shown" onclick="showInOverlay(${i})">
    <div class="front displayFlex">
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
    <div class="back displayFlex displayNone" style="transform: scaleX(-1);">
        <div class="diagramm"></div>

        <div class="evolutions displayFlex">
            <p class="evolvesTo">Evolves to:</p>
            ${pokeInfos[i].evolutionsAsHtml}
        </div>
    </div>
</div>`;
}

function setCards(start=0) {
    for(let i=start; i<pokeInfos.length; i++) {
        let card = /* HTML */ `
        <div class="imgCont displayFlex shown" onclick="showInOverlay(${i})">
            <div class="front displayFlex">
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
            <div class="back displayFlex displayNone" style="transform: scaleX(-1);">
                <div class="diagramm"></div>

                <div class="evolutions displayFlex">
                    <p class="evolvesTo">Evolves to:</p>
                    ${pokeInfos[i].evolutionsAsHtml}
                </div>
            </div>
        </div>`;
        document.querySelector('.allCards').innerHTML += card;
        window.scrollTo(0, document.body.scrollHeight);
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
    if(i === diff-1) {
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
    <div class="overlaySlider displayFlex" onkeyup="(event)=>{checkSlideKeys(event, ${i})}"></div>
    <button class="arrow-prev displayFlex" onclick="checkSlidePerce(${i}, 'prev')"><img src="./images/arrowPrev.svg" alt=""></button>
    <button class="arrow-next displayFlex" onclick="checkSlidePerce(${i}, 'next')"><img src="./images/arrowPrev.svg" alt=""></button>`;
    loadSlider(i);
    document.querySelectorAll('.overlay .slideCont')[1].querySelector('.imgCont').classList.add('rotateAble');
    rotateAbleCard = document.querySelectorAll('.overlay .imgCont')[1];
}

function checkSlideKeys(event, i) {
    if(event.key === "left") {
        checkSlidePerce(i, 'prev');
    }else if(event.key === "right") {
        checkSlidePerce(i, 'next');
    }
}

function loadSlider(i) {
    let inner;
    if(i === 0) {
        document.querySelector('.arrow-prev').classList.add('displayNone');
        inner = `<div class="slideCont"></div>`+ setSlide(i) + setSlide(i+1);
    }else if(i+1 === lastIndex) {
        document.querySelector('.arrow-next').classList.add('displayNone');
        inner = setSlide(i-1) + setSlide(i) + `<div class="slideCont"></div>`;
    }else {
        document.querySelector('.arrow-prev').classList.remove('displayNone');
        document.querySelector('.arrow-next').classList.remove('displayNone');
        inner = setSlide(i-1) + setSlide(i) + setSlide(i+1);
    }
    document.querySelector('.overlaySlider').innerHTML = inner;
    rotateVal = 1.44;
}

function setSlide(i) {
    i--;
    return /* HTML */`<div class="slideCont displayFlex">
    <div class="imgCont displayFlex shown" onclick="checkRotateVal(event, ${i+1})">
        <div class="front displayFlex">
            <div class="name displayFlex" style="background-color: ${getBgc(pokeInfos[i+1].type)};">
                <p>#${i+2}: ${pokeInfos[i+1].name.charAt(0).toUpperCase() + pokeInfos[i+1].name.slice(1)}</p>
            </div>
            <img src="${pokeInfos[i+1].image}" alt="">
            <p>Type: ${pokeInfos[i+1].type}</p>
            <div class="playNoice displayFlex" onclick="startPlayer(event, '${pokeInfos[i+1].noice}')">
                <p>Noice: </p>
                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="7,5 15,10 7,15" fill="white"/>
                </svg>
            </div>
        </div>
        <div class="back displayFlex displayNone" style="transform: scaleX(-1);">
            <div class="diagramm displayFlex">
                <div class="hp" id="hp${i+1}">
                    <p>HP</p>
                <div class="bar"><div class="inner"></div></div>
                </div>
                <div class="attack" id="attack${i+1}">
                    <p>Attack</p>
                    <div class="bar"><div class="inner"></div></div>
                </div>
                <div class="defense" id="defense${i+1}">
                    <p>Defense</p>
                    <div class="bar"><div class="inner"></div></div>
                </div>
                <div class="specialAttack" id="specialAttack${i+1}">
                    <p>Sp.-Attack</p>
                    <div class="bar"><div class="inner"></div></div>
                </div>
                <div class="specialDefense" id="specialDefense${i+1}">
                    <p>Sp.-Def.</p>
                    <div class="bar"><div class="inner"></div></div>
                </div>
                <div class="speed" id="speed${i+1}">
                    <p>Speed</p>
                    <div class="bar"><div class="inner"></div></div>
                </div>
            </div>

            <div class="separator"></div>

            <div class="evolutions displayFlex">
                <p class="evolvesTo">Evolves to:</p>
                <div class="evos displayFlex">
                    ${evosHtmlArr[i+1]}
                </div>
            </div>
        </div>
    </div>
</div>`
}

function checkSlidePerce(i, prevNext) {
    if(slidePerce != 0) {
        return;
    }else {
        shiftSlider(i, prevNext);
    }
}

function shiftSlider(i, prevNext) {
    if(prevNext === "prev") {
        slidePerce++;
    }else {
        slidePerce--;
    }
    document.querySelectorAll('.slideCont').forEach((elem)=>{
        elem.style.transform = `translateX(${slidePerce}%)`
    })
    if(slidePerce === -100 || slidePerce === 100) {
        slidePerce = 0;
        if(prevNext === "prev") {
            document.querySelector('.overlaySlider').innerHTML = "";
            showInOverlay(i-1);
            return;
        }else {
            document.querySelector('.overlaySlider').innerHTML = "";
            showInOverlay(i+1);
            return;
        }
    }
    setTimeout(()=>{
        shiftSlider(i, prevNext);
    }, 5)
}

function closeOverlay() {
    overlay.classList.add('displayNone');
    rotateVal = 1.44;
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
        document.querySelectorAll('.imgCont')[i].classList.add('shown');
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

function setKeywords () {
    let searchVal = document.querySelector('#searchAttributes').value;
    let keyWord = "";
    let extractedKeys = [];
    if(searchVal.includes("  ")) {
        searchVal.slice(0, searchVal.length-1);
        if(searchVal === "") {
            document.querySelector('#searchAttributes').value = "";
            showAllPokemon();
        }else {
            document.querySelector('#searchAttributes').value = searchVal;
        }
    }
    for(let i=0; i<searchVal.length; i++) {
        if(searchVal[i] === " ") {
            extractedKeys.push(keyWord);
            keyWord = "";
        }else if(i+1 === searchVal.length) {
            keyWord += searchVal[i];
            extractedKeys.push(keyWord);
            keyWord = "";
            keys = extractedKeys;
        }else {
            keyWord += searchVal[i];
            keys = extractedKeys;
        }
    }
    searchCards();
}

function searchCards() {
    let input = document.querySelector('#searchAttributes');
    let cards = document.querySelectorAll('.imgCont');
    let val = input.value;
    if(val === "") {
        showAllPokemon();
        keys = [];
        return;
    }
    for(let i=0; i<cards.length; i++) {
        for(let j=0; j<keys.length; j++) {
            if(pokeInfos[i].name.includes(keys[j]) || pokeInfos[i].type.includes(keys[j])) {
                cards[i].classList.add('shown');
            }else {
                cards[i].classList.remove('shown');
            }
        }
    }
}

function fromTo() {
    let cards = document.querySelectorAll('.imgCont');
    let from = +document.querySelector('#from').value === 0 ? 1 : +document.querySelector('#from').value;
    let to = +document.querySelector('#to').value === 0 ? lastIndex : +document.querySelector('#to').value;
    showAllPokemon();
    if(from > to) {
        return;
    }
    if(to > from && lastIndex < to) {
        loadMissingPokemon(lastIndex, to);
    }
    for(let i=0; i<from-1; i++)  {
        cards[i].classList.add('displayNone');
    }
    for(let j=to; j<lastIndex-1; j++) {
        cards[j].classList.add('displayNone');
    }
}

async function loadMissingPokemon(indexFirstNew, to) {
    document.querySelector('.loadingBar').classList.remove('displayNone');
    for(let i=indexFirstNew; i<to; i++) {
        data = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        data = await data.json();
        pokeInfos.push({
            type: data.types[0].type.name,
            name: data.species.name,
            image: data.sprites.front_default,
            noice: data.cries.latest,
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            specialAttack: data.stats[3].base_stat,
            specialDefense: data.stats[4].base_stat,
            speed: data.stats[5].base_stat
        });
        let card = /* HTML */ `
            <div class="imgCont displayFlex" onclick="showInOverlay(${i-1})">
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
        loadingBarRemaining(i-indexFirstNew, to-indexFirstNew);
    }
    lastIndex = to;
    //updateLocalstorage();
    setCards(indexFirstNew);
}

function updateLocalstorage() {
    localStorage.removeItem('pokeData');
    localStorage.setItem('pokeData', JSON.stringify(pokeInfos));
}

function checkRotateVal(event, i) {
    event.stopPropagation();
    if(+(rotateVal % 180).toFixed(2) === 1.44) {
        rotateCard(i);
    }else {
        return;
    }
}

function rotateCard(i) {
    if(rotateVal === 89.28 || rotateVal === 269.28) {
        setDisplayFrontBack();
    }else if(rotateVal % 180 === 0 && rotateVal > 0) {
        if(rotateVal === 360) {
            rotateVal = 1.44;
        }else {
            rotateVal+=1.44;
            loadSpecs(i);
        }
        return;
    }
    rotateVal+=1.44;
    rotateVal = +rotateVal.toFixed(2);
    rotateAble = document.querySelectorAll('.overlay .slideCont')[1].querySelector('.imgCont').style.transform = `rotateY(${rotateVal}deg) scale(2)`;
    setTimeout(()=>{rotateCard(i);}, 2);
}

function setDisplayFrontBack () {
    if(document.querySelector('.rotateAble .front').classList.contains('displayNone')) {
        document.querySelector('.rotateAble .front').classList.remove('displayNone');
        document.querySelector('.rotateAble .back').classList.add('displayNone');
    }else {
        document.querySelector('.rotateAble .back').classList.remove('displayNone');
        document.querySelector('.rotateAble .front').classList.add('displayNone');
    }
}

function loadSpecs(i) {
    loadHp(i);
    loadAttack(i);
    loadDefense(i);
    loadSpecialAttack(i);
    loadSpecialDefense(i);
    loadSpeed(i);
}

function loadHp(i, perce=0) {
    if(document.querySelectorAll('.allCards .imgCont')[i].classList.contains('specsShown')) {
        showSpecsImmediately(i);
        return;
    }
    perce++;
    document.querySelector(`#hp${i} .bar .inner`).style.width = `${perce/150*pokeInfos[i].hp}%`;
    document.querySelector(`#hp${i} .bar .inner`).innerHTML = `<p>${Math.ceil(perce/100*pokeInfos[i].hp)}</p>`;
    if(perce === 100) {
        document.querySelectorAll('.imgCont')[i].classList.add('specsShown');
        return;
    }
    setTimeout(()=>{
        loadHp(i, perce);
    }, 10)
}

function loadAttack(i, perce=0) {
    if(document.querySelectorAll('.allCards .imgCont')[i].classList.contains('specsShown')) {
        showSpecsImmediately(i);
        return;
    }
    perce++;
    document.querySelector(`#attack${i} .bar .inner`).style.width = `${perce/150*pokeInfos[i].attack}%`;
    document.querySelector(`#attack${i} .bar .inner`).innerHTML = `<p>${Math.ceil(perce/100*pokeInfos[i].attack)}</p>`;
    if(perce === 100) {
        return;
    }
    setTimeout(()=>{
        loadAttack(i, perce);
    }, 10)
}

function loadDefense(i, perce=0) {
    if(document.querySelectorAll('.allCards .imgCont')[i].classList.contains('specsShown')) {
        showSpecsImmediately(i);
        return;
    }
    perce++;
    document.querySelector(`#defense${i} .bar .inner`).style.width = `${perce/150*pokeInfos[i].defense}%`;
    document.querySelector(`#defense${i} .bar .inner`).innerHTML = `<p>${Math.ceil(perce/100*pokeInfos[i].defense)}</p>`;
    if(perce === 100) {
        return;
    }
    setTimeout(()=>{
        loadDefense(i, perce);
    }, 10)
}

function loadSpecialAttack(i, perce=0) {
    if(document.querySelectorAll('.allCards .imgCont')[i].classList.contains('specsShown')) {
        showSpecsImmediately(i);
        return;
    }
    perce++;
    document.querySelector(`#specialAttack${i} .bar .inner`).style.width = `${perce/150*pokeInfos[i].specialAttack}%`;
    document.querySelector(`#specialAttack${i} .bar .inner`).innerHTML = `<p>${Math.ceil(perce/100*pokeInfos[i].specialAttack)}</p>`;
    if(perce === 100) {
        return;
    }
    setTimeout(()=>{
        loadSpecialAttack(i, perce);
    }, 10)
}

function loadSpecialDefense(i, perce=0) {
    if(document.querySelectorAll('.allCards .imgCont')[i].classList.contains('specsShown')) {
        showSpecsImmediately(i);
        return;
    }
    perce++;
    document.querySelector(`#specialDefense${i} .bar .inner`).style.width = `${perce/150*pokeInfos[i].specialDefense}%`;
    document.querySelector(`#specialDefense${i} .bar .inner`).innerHTML = `<p>${Math.ceil(perce/100*pokeInfos[i].specialDefense)}</p>`;
    if(perce === 100) {
        return;
    }
    setTimeout(()=>{
        loadSpecialDefense(i, perce);
    }, 10)
}

function loadSpeed(i, perce=0) {
    if(document.querySelectorAll('.allCards .imgCont')[i].classList.contains('specsShown')) {
        showSpecsImmediately(i);
        return;
    }
    perce++;
    document.querySelector(`#speed${i} .bar .inner`).style.width = `${perce/150*pokeInfos[i].speed}%`;
    document.querySelector(`#speed${i} .bar .inner`).innerHTML = `<p>${Math.ceil(perce/100*pokeInfos[i].speed)}</p>`;
    if(perce === 100) {
        return;
    }
    setTimeout(()=>{
        loadSpeed(i, perce);
    }, 10)
}

function showSpecsImmediately(i) {
    document.querySelector(`#hp${i} .bar .inner`).style.height = `${pokeInfos[i].hp}%`;
    document.querySelector(`#hp${i} .bar .inner`).innerHTML = `<p>${pokeInfos[i].hp}</p>`;
    document.querySelector(`#attack${i} .bar .inner`).style.height = `${pokeInfos[i].attack}%`;
    document.querySelector(`#attack${i} .bar .inner`).innerHTML = `<p>${pokeInfos[i].attack}</p>`;
    document.querySelector(`#defense${i} .bar .inner`).style.height = `${pokeInfos[i].defense}%`;
    document.querySelector(`#defense${i} .bar .inner`).innerHTML = `<p>${pokeInfos[i].defense}</p>`;
    document.querySelector(`#specialAttack${i} .bar .inner`).style.height = `${pokeInfos[i].specialAttack}%`;
    document.querySelector(`#specialAttack${i} .bar .inner`).innerHTML = `<p>${pokeInfos[i].specialAttack}</p>`;
    document.querySelector(`#specialDefense${i} .bar .inner`).style.height = `${pokeInfos[i].specialDefense}%`;
    document.querySelector(`#specialDefense${i} .bar .inner`).innerHTML = `<p>${pokeInfos[i].specialDefense}</p>`;
    document.querySelector(`#speed${i} .bar .inner`).style.height = `${pokeInfos[i].speed}%`;
    document.querySelector(`#speed${i} .bar .inner`).innerHTML = `<p>${pokeInfos[i].speed}</p>`;    
}

document.querySelector('body').addEventListener('keyup', (event)=>{
    event.stopPropagation();
    console.log(5);
    if(event.key === 'Escape') {
        closeOverlay();
    }
})