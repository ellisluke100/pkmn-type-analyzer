// Flow;
// Choose a pokemon name
// Fetch the pokemon's OFFICIAL-ARTWORK->front-default and display. 
// Fetch the pokemon's one or two types, and display appropriately with the actual type images.
// Recompute the resistance matrix.
// Update the graph display.

/*
fetch(requestString)
    .then((response) => {
        //Check if response fulfilled or not here right?
        return response.json();
    })
    .then((data) => {outputText.textContent = data.types[0].type.name})
}*/

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
    //const singlePokemonJSON = await singlePokemonResponse.json();
    //const singlePokemonData = singlePokemonJSON.sprites;
    //return singlePokemonData;
    return await singlePokemonResponse.json();
    // sprites -> other -> official-artwork -> front-default
    
}

function onInputChange() {
    removeAutocompleteDropdown();

    const inputValue = inputElement.value.toLowerCase();
    const filteredNames = [];

    if (inputValue.length === 0) {
        if (pkmnImage.src != pkmnImageDefault) {
            pkmnImage.src = pkmnImageDefault;
            updateTypesDisplay([]);
        }
        return;
    }
    
    allPokemonNames.forEach((pkmnName) => {
        if (pkmnName.substr(0, inputValue.length) === inputValue) {
            filteredNames.push(pkmnName);
        }
    })

    createAutocompleteDropdown(filteredNames);
}

function createAutocompleteDropdown(namesList) {
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
    inputElement.value = buttonElement.textContent;
    updatePkmnDisplay(buttonElement.textContent);
    removeAutocompleteDropdown();
}

function updatePkmnDisplay(pkmnName) {
    let pkmnData = {};

    getSinglePokemonData(pkmnName).then((data) => {
        pkmnData = data;
    }).then(() => {
        //console.log(pkmnData);

        let imgURL = pkmnData.sprites.other["official-artwork"].front_default;
        updatePkmnImage(imgURL);

        let types = [];
        types.push(pkmnData.types[0].type.name);
        if (pkmnData.types[1]) { types.push(pkmnData.types[1].type.name)};
        updateTypesDisplay(types);
    });
}

function updateTypesDisplay(types) {
    //Reset types

    if (types.length == 0) {
        typeImgOne.src = pkmnTypeDefault;
        typeImgTwo.src = pkmnTypeDefault;
        return;
    }

    let i = 1;

    types.forEach((type) => {
        document.querySelector(`#type-img-${i}`).src = 
        `/images/type_icons/${type}.svg`;
        i++;
    })

    if (types.length == 1) {
        document.querySelector("#type-img-2").src = pkmnTypeDefault;
    }
}

function updatePkmnImage(imgURL) {
    pkmnImage.src = imgURL;
}

const inputElement = document.querySelector("#autocomplete-input");
const autocompleteElement = document.querySelector("#autocomplete-container-id");
const pkmnImage = document.querySelector('#pkmn-image');
const pkmnImageDefault = "https://cdn-icons.flaticon.com/png/512/3524/premium/3524344.png?token=exp=1646772214~hmac=fd49d71849a9b61089ad2ec4a2bce11b"
const pkmnTypeDefault = "https://cdn0.iconfinder.com/data/icons/octicons/1024/dash-512.png"
const typeImgOne = document.querySelector("#type-img-1");
const typeImgTwo = document.querySelector("#type-img-2");

inputElement.addEventListener("input", onInputChange);

let allPokemonNames = [];
let allPokemonNamesRequest = new Request("https://pokeapi.co/api/v2/pokemon?limit=1126"); //Theres 1126 pokemon and regional formes and stuff

getAllPokemonNames();