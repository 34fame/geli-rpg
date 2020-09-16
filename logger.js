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


export { eventLog, gameMessage }
