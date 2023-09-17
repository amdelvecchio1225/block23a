// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2109-UNF-HY-WEB-PT";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;
const mainElem = document.getElementById("mainContainer");

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(API_URL + '/players');
    const result = await response.json();
    console.log(result);
    return(result.data.players);
  } catch (err) {
    console.error("Trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(API_URL + '/players/' + playerId);
    const result = await response.json();
    return(result.data.player);
  } catch (err) {
    console.error("Trouble fetching a player!", err);
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  const players = document.createElement("div");

  if (playerList.length === 0) {
    players.innerHTML = "<h2>No players found!</h2>";
  }
  else {
    playerList.forEach((player) => {
      const card = document.createElement("div");

      const name = document.createElement("h3");
      name.textContent = player.name;

      const id = document.createElement("p");
      id.textContent = "Player ID: " + player.id;

      const image = document.createElement("img");
      image.src = player.imageUrl;
      image.alt = player.name;

      const seeDetails = document.createElement("button");
      seeDetails.textContent = "See Details";
      seeDetails.addEventListener("click", () => {
        renderSinglePlayer(player);
      })

      card.appendChild(name);
      card.appendChild(id);
      card.appendChild(image);
      card.appendChild(seeDetails);

      players.appendChild(card);
    });
  }

  // Clear previous content and update list
  mainElem.innerHTML = "";
  mainElem.appendChild(players);
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = async (player) => {
  const singlePlayer = await fetchSinglePlayer(player.id);

  const card = document.createElement("div");

  const name = document.createElement("h3");
  name.innerHTML = singlePlayer.name;

  const id = document.createElement("p");
  id.innerHTML = "Player ID: " + singlePlayer.id;

  const breed = document.createElement("p");
  breed.textContent = "Breed: " + singlePlayer.breed;

  const team = document.createElement("p");
  if (singlePlayer.teamId === null) {
    team.textContent = "Team: Unassigned";
  }
  else {
    team.textContent = "Team: " + singlePlayer.teamId;
  }

  const image = document.createElement("img");
  image.src = singlePlayer.imageUrl;
  image.alt = singlePlayer.name;

  const goBack = document.createElement("button");
  goBack.textContent = "Back to Player List";
  goBack.addEventListener("click", () => {
    init();
  });

  card.appendChild(name);
  card.appendChild(id);
  card.appendChild(breed);
  card.appendChild(team);
  card.appendChild(image);
  card.appendChild(goBack);

  // Clear previous content and update list
  mainElem.innerHTML = "";
  mainElem.appendChild(card);
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    renderAllPlayers,
    renderSinglePlayer,
  };
} else {
  init();
}
