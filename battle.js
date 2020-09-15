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

const GAME = {
  attacker: null,
  defender: null,
  player1: {
    hp: 10,
    weapon: "hand",
  },
  player2: {
    hp: 10,
    weapon: "hand",
  },
  weapons: {
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
  },
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
  //    console.log(LOG_COLORS[color]);
  //   console.log(message);
  //   console.log(LOG_COLORS.white);
};

const rollDie = (sides) => {
  const roll = Math.floor(Math.random() * Math.floor(sides)) + 1;
  eventLog("debug", "rollDie " + roll);
  return roll;
};

const endOfTurn = () => {
  if (GAME.attacker === "player1") {
    GAME.attacker = "player2";
  } else {
    GAME.attacker = "player1";
  }

  if (GAME.defender === "player1") {
    GAME.defender = "player2";
  } else {
    GAME.defender = "player1";
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
  GAME.player1.weapon = Object.keys(GAME.weapons)[weaponRoll - 1];
  gameMessage("magenta", "Player1 received a " + GAME.player1.weapon);
  weaponRoll = rollDie(4);
  GAME.player2.weapon = Object.keys(GAME.weapons)[weaponRoll - 1];
  gameMessage("magenta", "Player2 received a " + GAME.player2.weapon);
  console.log("");
};

const rollOutcome = (roll) => {
  eventLog("debug", "Determining roll outcome...");
  let attacker = GAME.attacker;
  let weapon = GAME[attacker].weapon;

  let current = 1;
  let result;
  Object.keys(OUTCOMES).map((key) => {
    let min = current;
    let max = current + (OUTCOMES[key] - 1) + GAME.weapons[weapon][key];
    current = max + 1;
    if (roll >= min && roll <= max) {
      result = key;
      eventLog("debug", "Determined result as " + key);
    }
  });
  return result;
};

while (GAME.player1.hp > 0 && GAME.player2.hp > 0) {
  if (!GAME.attacker) startGAME();
  let attacker = GAME.attacker;
  let weapon = GAME[attacker].weapon;

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
    GAME[GAME.defender].hp = GAME[GAME.defender].hp - damageRoll;
    gameMessage(
      "blue",
      GAME.defender +
        " hit for " +
        damageRoll +
        " leaving " +
        GAME[GAME.defender].hp +
        " health"
    );

    // Normal Hit
  } else if (rollOutcome(attackRoll) === "HIT") {
    gameMessage("green", GAME.attacker + " scored a Hit!");
    let damageRoll = rollDie(4);
    damageRoll += 3;
    GAME[GAME.defender].hp = GAME[GAME.defender].hp - damageRoll;
    gameMessage(
      "blue",
      GAME.defender +
        " hit for " +
        damageRoll +
        " leaving " +
        GAME[GAME.defender].hp +
        " health"
    );

    // Weak Hit
  } else if (rollOutcome(attackRoll) === "WEAK") {
    gameMessage("yellow", GAME.attacker + " scored a Weak Hit!!");
    let damageRoll = rollDie(3);
    GAME[GAME.defender].hp = GAME[GAME.defender].hp - damageRoll;
    gameMessage(
      "blue",
      GAME.defender +
        " hit for " +
        damageRoll +
        " leaving " +
        GAME[GAME.defender].hp +
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
    GAME[GAME.attacker].hp = GAME[GAME.attacker].hp - damageRoll;
    gameMessage(
      "blue",
      GAME.attacker +
        " hit for " +
        damageRoll +
        " leaving " +
        GAME[GAME.attacker].hp +
        " health"
    );
  }

  // Turn ends...
  endOfTurn();
}

let winner;
if (GAME.player1.hp > 0) {
  winner = "player1";
} else {
  winner = "player2";
}

gameMessage("magenta", "");
gameMessage("magenta", winner + " is victorious!");
