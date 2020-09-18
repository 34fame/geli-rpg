import rollDie from "./roller.js";

const PLAYERS = {
  player1: {
    attributes: {},
  },
  player2: {
    attributes: {},
  },
};

const generatePlayers = () => {
  const ATTRIBS = ["STR", "INT", "WIS", "CHA", "DEX", "CON"];

  Object.keys(PLAYERS).map((player) => {
    ATTRIBS.map((attrib) => {
      PLAYERS[player].attributes[attrib] = rollDie(20);
    });
  });

  console.log(JSON.stringify(PLAYERS, null, 3));

  return PLAYERS;
};

export default generatePlayers;

