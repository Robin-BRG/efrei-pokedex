async function fetchAllPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000'); // Limite à 1000 pour obtenir tous les Pokémon
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results;
}

async function fetchPokemonData(pokemonName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}

function getTypeColor(type) {
    const colors = {
        grass: '#78C850',
        fire: '#F08030',
        water: '#6890F0',
        bug: '#A8B820',
        normal: '#A8A878',
        electric: '#F8D030',
        ground: '#E0C068',
        fairy: '#EE99AC',
        fighting: '#C03028',
        psychic: '#F85888',
        rock: '#B8A038',
        ghost: '#705898',
        ice: '#98D8D8',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        poison: '#A040A0',
        flying: '#A890F0'
    };
    return colors[type] || '#A8A878';
}

function lightenColor(color, percent) {
    const num = parseInt(color.slice(1), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1).toUpperCase()}`;
}

function createPokemonCard(pokemon, pokemonId) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    // Get the colors for the types
    const typeColors = pokemon.types.map(typeInfo => getTypeColor(typeInfo.type.name));
    const gradient = typeColors.length > 1
        ? `linear-gradient(135deg, ${typeColors[0]}, ${typeColors[1]})`
        : `linear-gradient(135deg, ${typeColors[0]}, ${lightenColor(typeColors[0], 40)})`;

    card.style.background = gradient;

    const pokedexNumber = document.createElement('div');
    pokedexNumber.classList.add('pokedex-number');
    pokedexNumber.textContent = `#${String(pokemonId).padStart(3, '0')}`;

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('pokemon-image');
    const img = document.createElement('img');
    img.src = pokemon.sprites.front_default;
    img.alt = `${pokemon.name} Image`;
    imageDiv.appendChild(img);

    const nameDiv = document.createElement('div');
    nameDiv.classList.add('pokemon-name');
    nameDiv.textContent = pokemon.name;

    const typeContainerDiv = document.createElement('div');
    typeContainerDiv.classList.add('pokemon-type-container');

    const typeDiv = document.createElement('div');
    typeDiv.classList.add('pokemon-type');
    pokemon.types.forEach(typeInfo => {
        const typeSpan = document.createElement('span');
        typeSpan.classList.add('type-capsule', `type-${typeInfo.type.name}`);
        typeSpan.textContent = typeInfo.type.name;
        typeDiv.appendChild(typeSpan);
    });

    const showStatsButton = document.createElement('i');
    showStatsButton.classList.add('fa-solid', 'fa-arrow-up', 'show-stats-button');
    showStatsButton.addEventListener('click', (event) => {
        event.stopPropagation();
        card.classList.toggle('show-stats');
    });

    const shinyIcon = document.createElement('i');
    shinyIcon.classList.add('fa-regular', 'fa-star', 'shiny-icon');
    shinyIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        if (img.src === pokemon.sprites.front_default) {
            img.src = pokemon.sprites.front_shiny;
            shinyIcon.classList.remove('fa-regular');
            shinyIcon.classList.add('fa-solid');
        } else {
            img.src = pokemon.sprites.front_default;
            shinyIcon.classList.remove('fa-solid');
            shinyIcon.classList.add('fa-regular');
        }
    });

    typeContainerDiv.appendChild(typeDiv);

    const statsOverlay = document.createElement('div');
    statsOverlay.classList.add('pokemon-stats-overlay');
    statsOverlay.innerHTML = `
        <div class="stat-bar-container">
            <span class="stat-bar-label">HP</span>
            <div class="stat-bar"><div class="stat-bar-fill hp" style="width: ${pokemon.stats[0].base_stat}%;">${pokemon.stats[0].base_stat}</div></div>
        </div>
        <div class="stat-bar-container">
            <span class="stat-bar-label">Attack</span>
            <div class="stat-bar"><div class="stat-bar-fill attack" style="width: ${pokemon.stats[1].base_stat}%;">${pokemon.stats[1].base_stat}</div></div>
        </div>
        <div class="stat-bar-container">
            <span class="stat-bar-label">Defense</span>
            <div class="stat-bar"><div class="stat-bar-fill defense" style="width: ${pokemon.stats[2].base_stat}%;">${pokemon.stats[2].base_stat}</div></div>
        </div>
        <div class="stat-bar-container">
            <span class="stat-bar-label">Sp. Atk</span>
            <div class="stat-bar"><div class="stat-bar-fill sp-attack" style="width: ${pokemon.stats[3].base_stat}%;">${pokemon.stats[3].base_stat}</div></div>
        </div>
        <div class="stat-bar-container">
            <span class="stat-bar-label">Sp. Def</span>
            <div class="stat-bar"><div class="stat-bar-fill sp-defense" style="width: ${pokemon.stats[4].base_stat}%;">${pokemon.stats[4].base_stat}</div></div>
        </div>
        <div class="stat-bar-container">
            <span class="stat-bar-label">Speed</span>
            <div class="stat-bar"><div class="stat-bar-fill speed" style="width: ${pokemon.stats[5].base_stat}%;">${pokemon.stats[5].base_stat}</div></div>
        </div>
    `;

    card.appendChild(pokedexNumber);
    card.appendChild(imageDiv);
    card.appendChild(nameDiv);
    card.appendChild(typeContainerDiv);
    card.appendChild(showStatsButton);
    card.appendChild(statsOverlay);
    card.appendChild(shinyIcon);

    return card;
}

function getGeneration(pokemonId) {
    if (pokemonId <= 151) return 1;
    if (pokemonId <= 251) return 2;
    if (pokemonId <= 386) return 3;
    if (pokemonId <= 493) return 4;
    if (pokemonId <= 649) return 5;
    if (pokemonId <= 721) return 6;
    if (pokemonId <= 809) return 7;
    if (pokemonId <= 905) return 8;
    if (pokemonId <= 1008) return 9;
    return 0;
}

function filterPokemonByGeneration(pokemonList, selectedGenerations) {
    return pokemonList.filter(pokemon => {
        const pokemonId = parseInt(pokemon.url.split('/').slice(-2, -1)[0]);
        const generation = getGeneration(pokemonId);
        return selectedGenerations.includes(generation);
    });
}

function filterPokemonByType(pokemonList, selectedTypes) {
    return pokemonList.filter(pokemon => {
        return pokemon.types.some(typeInfo => selectedTypes.includes(typeInfo.type.name));
    });
}

function filterPokemonByName(pokemonList, searchTerm) {
    return pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()));
}

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('pokemon-container');
    const generationFilters = document.querySelectorAll('.generation-filter');
    const typeFilters = document.querySelectorAll('.type-filter');
    const searchBar = document.getElementById('search-bar');
    const sortButton = document.getElementById('sort-button');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageNumberSpan = document.getElementById('page-number');

    let allPokemon = [];
    let currentPage = 1;
    const itemsPerPage = 20;
    let sortAscending = true;

    try {
        const pokemonList = await fetchAllPokemon();
        allPokemon = pokemonList;
        displayFilteredPokemon();
    } catch (error) {
        console.error('Error fetching all Pokémon:', error);
    }

    generationFilters.forEach(filter => {
        filter.addEventListener('change', displayFilteredPokemon);
    });

    typeFilters.forEach(filter => {
        filter.addEventListener('change', displayFilteredPokemon);
    });

    searchBar.addEventListener('input', displayFilteredPokemon);

    sortButton.addEventListener('click', () => {
        sortAscending = !sortAscending;
        displayFilteredPokemon();
    });

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayFilteredPokemon();
        }
    });

    nextPageButton.addEventListener('click', () => {
        currentPage++;
        displayFilteredPokemon();
    });

    async function displayFilteredPokemon() {
        container.innerHTML = '';
        const selectedGenerations = Array.from(generationFilters)
            .filter(filter => filter.checked)
            .map(filter => parseInt(filter.value));

        const selectedTypes = Array.from(typeFilters)
            .filter(filter => filter.checked)
            .map(filter => filter.value);

        const searchTerm = searchBar.value;

        if (selectedGenerations.length === 0) {
            return;
        }

        let filteredPokemon = filterPokemonByGeneration(allPokemon, selectedGenerations);

        if (selectedTypes.length > 0) {
            filteredPokemon = await Promise.all(filteredPokemon.map(async (pokemon) => {
                const data = await fetchPokemonData(pokemon.name);
                return data;
            }));
            filteredPokemon = filterPokemonByType(filteredPokemon, selectedTypes);
        } else {
            filteredPokemon = await Promise.all(filteredPokemon.map(async (pokemon) => {
                const data = await fetchPokemonData(pokemon.name);
                return data;
            }));
        }

        if (searchTerm) {
            filteredPokemon = filterPokemonByName(filteredPokemon, searchTerm);
        }

        if (sortAscending) {
            filteredPokemon.sort((a, b) => a.id - b.id);
        } else {
            filteredPokemon.sort((a, b) => b.id - a.id);
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedPokemon = filteredPokemon.slice(startIndex, endIndex);

        for (const pokemon of paginatedPokemon) {
            try {
                const pokemonId = parseInt(pokemon.id);
                const card = createPokemonCard(pokemon, pokemonId);
                container.appendChild(card);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        pageNumberSpan.textContent = currentPage;
    }
});