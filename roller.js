import { eventLog } from "./logger.js";

const rollDie = (sides) => {
  const roll = Math.floor(Math.random() * Math.floor(sides)) + 1;
  eventLog("debug", "rollDie " + roll);
  return roll;
};

export default rollDie;
