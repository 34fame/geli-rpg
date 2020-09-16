const LOG_LEVEL = "warn";
const LOG_LEVELS = {
  debug: 4,
  info: 3,
  warn: 2,
  error: 1,
};
const LOG_COLORS = {
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  yellow: "\x1b[33m",
};

const OUTCOMES = {
  CRITICAL: 10,
  HIT: 40,
  WEAK: 10,
  MISS: 30,
  BLUNDER: 10,
};

const PLAYERS = {
  player1: {
    hp: 10,
    weapon: "hand",
  },
  player2: {
    hp: 10,
    weapon: "hand",
  },
};

const WEAPONS = {
  hand: {
    CRITICAL: 0,
    HIT: 0,
    WEAK: 0,
    MISS: 0,
    BLUNDER: 0,
  },
  stick: {
    CRITICAL: 1,
    HIT: 0,
    WEAK: 1,
    MISS: -2,
    BLUNDER: 0,
  },
  shovel: {
    CRITICAL: 2,
    HIT: 1,
    WEAK: 2,
    MISS: -4,
    BLUNDER: -1,
  },
  sword: {
    CRITICAL: 4,
    HIT: 3,
    WEAK: 3,
    MISS: -7,
    BLUNDER: -3,
  },
};

const GAME = {
  attacker: null,
  defender: null,
};

const eventLog = (level, message) => {
  let logLevelSetting = LOG_LEVELS[LOG_LEVEL];
  let logLevel = LOG_LEVELS[level];
  if (logLevel <= logLevelSetting) {
    console.log("[" + level.toUpperCase() + "]", message);
  }
};

const gameMessage = (color, message) => {
  console.log(LOG_COLORS[color] + "%s" + LOG_COLORS.white, message);
};

const rollDie = (sides) => {
  const roll = Math.floor(Math.random() * Math.floor(sides)) + 1;
  eventLog("debug", "rollDie " + roll);
  return roll;
};

const endOfTurn = () => {
  if (GAME.attacker === "player1") {
    GAME.attacker = "player2";
    GAME.defender = "player1";
  } else {
    GAME.attacker = "player1";
    GAME.defender = "player2";
  }
  console.log("");
};

const startGAME = () => {
  eventLog("debug", "Determining attacker roll...");
  let determineAttackerRoll = rollDie(2);

  if (determineAttackerRoll === 0) {
    GAME.attacker = "player1";
    GAME.defender = "player2";
  } else {
    GAME.attacker = "player2";
    GAME.defender = "player1";
  }

  eventLog("debug", "Determining weapon roll...");
  let weaponRoll;
  weaponRoll = rollDie(4);
  PLAYERS.player1.weapon = Object.keys(WEAPONS)[weaponRoll - 1];
  gameMessage("magenta", "Player1 received a " + PLAYERS.player1.weapon);

  weaponRoll = rollDie(4);
  PLAYERS.player2.weapon = Object.keys(WEAPONS)[weaponRoll - 1];
  gameMessage("magenta", "Player2 received a " + PLAYERS.player2.weapon);
  console.log("");
};

const rollOutcome = (roll) => {
  eventLog("debug", "Determining roll outcome...");
  let attacker = GAME.attacker;
  let weapon = PLAYERS[attacker].weapon;

  let current = 1;
  let result;
  Object.keys(OUTCOMES).map((key) => {
    let min = current;
    let max = current + (OUTCOMES[key] - 1) + WEAPONS[weapon][key];
    current = max + 1;
    if (roll >= min && roll <= max) {
      result = key;
      eventLog("debug", "Determined result as " + key);
    }
  });
  return result;
};

// Main Game Loop
while (PLAYERS.player1.hp > 0 && PLAYERS.player2.hp > 0) {
  try {
    if (!GAME.attacker) startGAME();
    let attacker = GAME.attacker;
    let weapon = PLAYERS[attacker].weapon;

    gameMessage(
      "blue",
      GAME.attacker + " is attacking with their " + weapon + "..."
    );
    let attackRoll = rollDie(100);

    // Critical Hit
    if (rollOutcome(attackRoll) === "CRITICAL") {
      gameMessage("cyan", GAME.attacker + " scored a Critical Hit!!");
      let damageRoll = rollDie(5);
      damageRoll += 5;
      PLAYERS[GAME.defender].hp = PLAYERS[GAME.defender].hp - damageRoll;
      gameMessage(
        "blue",
        GAME.defender +
          " hit for " +
          damageRoll +
          " leaving " +
          PLAYERS[GAME.defender].hp +
          " health"
      );

      // Normal Hit
    } else if (rollOutcome(attackRoll) === "HIT") {
      gameMessage("green", GAME.attacker + " scored a Hit!");
      let damageRoll = rollDie(4);
      damageRoll += 3;
      PLAYERS[GAME.defender].hp = PLAYERS[GAME.defender].hp - damageRoll;
      gameMessage(
        "blue",
        GAME.defender +
          " hit for " +
          damageRoll +
          " leaving " +
          PLAYERS[GAME.defender].hp +
          " health"
      );

      // Weak Hit
    } else if (rollOutcome(attackRoll) === "WEAK") {
      gameMessage("yellow", GAME.attacker + " scored a Weak Hit!!");
      let damageRoll = rollDie(3);
      PLAYERS[GAME.defender].hp = PLAYERS[GAME.defender].hp - damageRoll;
      gameMessage(
        "blue",
        GAME.defender +
          " hit for " +
          damageRoll +
          " leaving " +
          PLAYERS[GAME.defender].hp +
          " health"
      );

      // Miss
    } else if (rollOutcome(attackRoll) === "MISS") {
      gameMessage("yellow", GAME.attacker + " missed!!");

      // Blunder
    } else {
      gameMessage(
        "red",
        GAME.attacker + " tripped on a rock and hurt themselves!!"
      );
      let damageRoll = rollDie(3);
      PLAYERS[GAME.attacker].hp = PLAYERS[GAME.attacker].hp - damageRoll;
      gameMessage(
        "blue",
        GAME.attacker +
          " hit for " +
          damageRoll +
          " leaving " +
          PLAYERS[GAME.attacker].hp +
          " health"
      );
    }

    // Turn ends...
    endOfTurn();
  } catch (e) {
    console.error(e);
    console.error(GAME);
    console.error(PLAYERS);
    break;
  }
}


// GAME OVER
let winner;
if (PLAYERS.player1.hp > 0) {
  winner = "player1";
} else {
  winner = "player2";
}

gameMessage("magenta", "");
gameMessage("magenta", winner + " is victorious!");
