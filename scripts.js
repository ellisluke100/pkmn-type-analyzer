// TO-DO
// Better page styling
// Graph styling and just more about that stuff
// Conclusion element; "your team is strong, or balanced, or weak"
//// Average the graphDataArray - if negative = weak, if around 0 = balanced, if above = strong

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
            // We've gotten rid of a pokemon
            console.log(resistancesList);
            resistancesList[`pokemon-${wrapperIndex+1}`].fill(null);
            updateResistancesChart();
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

    if (inputEl.value.length != 0) {
        resistancesList[`pokemon-${wrapperIndex+1}`].fill(null);
    }

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
        updateResistancesList(types, wrapperIndex+1)
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
        typeImgArray[i-1].src = `images/type_icons/${type}.svg`
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
        if (i == 6) { return;}
    }
}

function updateResistancesList(typeList, pkmnNum) {
    let resistances = resistancesList[`pokemon-${pkmnNum}`];
    let resIndex = 0;

    typeList[0] = typeList[0].charAt(0).toUpperCase() + typeList[0].slice(1);
    if (typeList[1]) {
        typeList[1] = typeList[1].charAt(0).toUpperCase() + typeList[1].slice(1);
    }

    for (let i = 0; i < typeList.length; i++) {
        let newResistances = typeChart.types[typeList[i]];

        for (const [type, value] of Object.entries(newResistances)) {
            if (resistances[resIndex] === null  ) {
                resistances[resIndex] = value;
            } else {
                resistances[resIndex] *= value;
            }
            resIndex++;
        }

        resIndex = 0;
    }

    updateResistancesChart();
}

function updateResistancesChart() {
    //resistancesList
    //graphDataArray
    graphDataArray.fill(0);
    for (let typeIndex = 0; typeIndex < 18; typeIndex++) {
        for (let pkmnNum = 1; pkmnNum <= 6; pkmnNum++) {
            let value = resistancesList[`pokemon-${pkmnNum}`][typeIndex];

            switch(value) {
                case 0.25: value = 2; break;
                case 0.5: value = 1; break;
                case 0: value = 2; break;
                case 1: value = 0; break;
                case 2: value = -1; break;
                case 4: value = -2; break;
                case null: value = 0; break;
            }

            graphDataArray[typeIndex] += value;
        }
    }

    // console.log(graphDataArray);
    const chart = Chart.getChart("chart");
    chart.update();
    updateTeamConclusion();

}

function updateTeamConclusion() {
    const ratingText = document.querySelector(".team-rating-text");
    const avg = Math.round(graphDataArray.reduce((a,b) => a + b, 0) / graphDataArray.length);

    if (avg == 2 || avg > 2) {ratingText.textContent = "VERY GOOD"; ratingText.id="very-good";}
    if (avg == 1) {ratingText.textContent = "GOOD"; ratingText.id="good";}
    if (avg == 0) {ratingText.textContent = "OK"; ratingText.id="ok";}
    if (avg == -1) {ratingText.textContent = "WEAK"; ratingText.id="weak";}
    if (avg == -2 || avg < -2) {ratingText.textContent = "VERY WEAK"; ratingText.id="very-weak";}

    const weaknessesContainer = document.querySelector(".team-weaknesses-type-icon-container");
    while (weaknessesContainer.hasChildNodes()) {
        weaknessesContainer.removeChild(weaknessesContainer.firstChild);
    }

    //typeList[0] = typeList[0].charAt(0).toUpperCase() + typeList[0].slice(1);

    for (let i = 0; i < graphDataArray.length; i++) {
        if (graphDataArray[i]<0) {
            const imgEl = document.createElement("img");
            imgEl.src = `images/type_icons/${
                typeList[i].charAt(0).toLowerCase() + typeList[i].slice(1)
            }.svg`;
            weaknessesContainer.appendChild(imgEl);
        }
    }
}

function createResistancesList() {
    // Initialise empty dictionary of pokemon's resistances
    // E.g. {pokemon: "1", resistances:{bug: 1, dark: 1....}}

    let dict = {};
    for (let n = 1; n < 7; n++) {
        dict[`pokemon-${n}`] = new Array(18).fill(null);
    }

    return dict;
}

function displayResistancesGraph() {
    const ctx = document.getElementById('chart');
    const chartLabels = Object.keys(typeChart.types);
    const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: typeList,
        datasets: [{
            label: '# of Votes',
            data: graphDataArray,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: false
                },
                beginAtZero: false,
                max: 4,
                min: -4
            },
        },
        maintainAspectRatio: false,
    }
});
}

// If the pokemon entered is the same as before, ignore it.

const pkmnImageDefault = "images/question-mark.png";
const pkmnTypeDefault = "images/dash-icon.png"
let chartRef;

let allPokemonNames = [];
let allPokemonNamesRequest = new Request("https://pokeapi.co/api/v2/pokemon?limit=1126"); //Theres 1126 pokemon and regional formes and stuff

getAllPokemonNames();
let resistancesList = createResistancesList();

const pkmnWrappers = loadPkmnWrappers();
addListenersToInputs();

let graphDataArray = new Array(18).fill(0);

const typeList = Object.keys(typeChart.types);
const overallRatingEl = document.querySelector(".team-rating-text");

// Chart stuff
displayResistancesGraph();
