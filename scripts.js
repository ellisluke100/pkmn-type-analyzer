// Flow;
// Choose a pokemon name
// Fetch the pokemon's OFFICIAL-ARTWORK->front-default and display. 
// Fetch the pokemon's one or two types, and display appropriately with the actual type images.
// Recompute the resistance matrix.
// Update the graph display.

// https://commons.wikimedia.org/wiki/Category:Pok%C3%A9mon_types_icons#/media/File:Pok%C3%A9mon_{type-name}_Type_Icon.svg
// Icons at: https://commons.wikimedia.org/wiki/Category:Pok%C3%A9mon_types_icons
// Question mark URL: https://cdn-icons.flaticon.com/png/512/3524/premium/3524344.png?token=exp=1646772214~hmac=fd49d71849a9b61089ad2ec4a2bce11b
// Dash mark (none type) URL: https://cdn0.iconfinder.com/data/icons/octicons/1024/dash-512.png

async function getAllPokemonNames() {
    const allPokemonResponse = await fetch(allPokemonNamesRequest);
    const allPokemonJSON = await allPokemonResponse.json();
    const allPokemonData = allPokemonJSON.results;

    allPokemonNames = allPokemonData.map((pkmn) => {
        return pkmn.name;
    });
}

async function getSinglePokemonData(pkmnName) {
    const pkmnURL = `https://pokeapi.co/api/v2/pokemon/${pkmnName}`;
    const singlePokemonResponse = await fetch(pkmnURL);
    return await singlePokemonResponse.json();
    
}

function onInputChange(e) {
    let inputEl = e.target;
    let wrapperIndex = inputEl.dataset.pkmn - 1;
    let pkmnImg = pkmnWrappers[wrapperIndex].querySelector(".pkmn-img");

    removeAutocompleteDropdown(); //DO!

    const inputValue = inputEl.value.toLowerCase();
    const filteredNames = [];

    if (inputValue.length === 0) {
        if (pkmnImg.src != pkmnImageDefault) {
            pkmnImg.src = pkmnImageDefault;
            updateTypesDisplay([], wrapperIndex);
        }
        return;
    }
    
    allPokemonNames.forEach((pkmnName) => {
        if (pkmnName.substr(0, inputValue.length) === inputValue) {
            filteredNames.push(pkmnName);
        }
    })

    createAutocompleteDropdown(filteredNames, wrapperIndex);
}

function createAutocompleteDropdown(namesList, wrapperIndex) {
    const listElement = document.createElement("ul");
    listElement.className = "autocomplete-list";
    listElement.id = "autocomplete-list-id";

    namesList.forEach((name) => {
        const listItem = document.createElement("li");
        const listItemButton = document.createElement("button");
        listItemButton.textContent = name;
        listItemButton.addEventListener("click", onNameButtonClick);
        listItem.appendChild(listItemButton);
        
        listElement.appendChild(listItem);
    });

    const autocompleteElement = pkmnWrappers[wrapperIndex].querySelector(".autocomplete-list-container");
    autocompleteElement.appendChild(listElement);
}

function removeAutocompleteDropdown() {
    const listElement = document.querySelector("#autocomplete-list-id");
    
    if (listElement) {
        listElement.remove();
    }
}

function onNameButtonClick(e) {
    e.preventDefault();
    const buttonElement = e.target;
    const inputEl = e.target.closest(".autocomplete-list-container").querySelector("input");
    const wrapperIndex = inputEl.dataset.pkmn - 1;
    pkmnWrappers[wrapperIndex].querySelector(".autocomplete-input").value = buttonElement.textContent;

    updatePkmnDisplay(buttonElement.textContent, wrapperIndex);
    removeAutocompleteDropdown();
}

function updatePkmnDisplay(pkmnName, wrapperIndex) {
    let pkmnData = {};

    getSinglePokemonData(pkmnName).then((data) => {
        pkmnData = data;
    }).then(() => {
        let imgURL = pkmnData.sprites.other["official-artwork"].front_default;
        updatePkmnImage(imgURL, wrapperIndex);

        let types = [];
        types.push(pkmnData.types[0].type.name);
        if (pkmnData.types[1]) { types.push(pkmnData.types[1].type.name)};
        updateTypesDisplay(types, wrapperIndex);
    });
}

function updatePkmnImage(imgURL, wrapperIndex) {
    const pkmnImg = pkmnWrappers[wrapperIndex].querySelector(".pkmn-img");
    pkmnImg.src = imgURL;
}

function updateTypesDisplay(types, wrapperIndex) {
    let typeImgArray = [];
    typeImgArray = pkmnWrappers[wrapperIndex].querySelectorAll(".type-img");

    if (types.length == 0) {
        typeImgArray[0].src = pkmnTypeDefault;
        typeImgArray[1].src = pkmnTypeDefault;
        return;
    }

    let i = 1;

    types.forEach((type) => {
        typeImgArray[i-1].src = `/images/type_icons/${type}.svg`
        i++;
    });

    if (types.length == 1) {
        typeImgArray[1].src = pkmnTypeDefault;
    }
}

function loadPkmnWrappers() {
    let i = 0;
    let currWrapper;
    let wrappersArray = [];
    while (currWrapper = document.querySelector(`#pkmn-wrapper-${i+1}`)) {
        wrappersArray.push(currWrapper);
        i++;
    }
    return wrappersArray;
}

function addListenersToInputs() {
    let inputEl;
    let i = 0;

    while (inputEl = pkmnWrappers[i].querySelector(".autocomplete-input")) {
        inputEl.addEventListener("input", onInputChange);
        i++;
        console.log(inputEl);
        if (i == 6) { return;}
    }
}

//const inputElement = document.querySelector("#autocomplete-input");
//const autocompleteElement = document.querySelector("#autocomplete-container-id");
const pkmnImageDefault = "/images/question-mark.png";
const pkmnTypeDefault = "https://cdn0.iconfinder.com/data/icons/octicons/1024/dash-512.png"

let allPokemonNames = [];
let allPokemonNamesRequest = new Request("https://pokeapi.co/api/v2/pokemon?limit=1126"); //Theres 1126 pokemon and regional formes and stuff

getAllPokemonNames();

const pkmnWrappers = loadPkmnWrappers();
addListenersToInputs();