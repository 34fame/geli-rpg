import * as db from "./rpgDB";

let collection = "players";
let obj = { name: "Graypes", level: 1 };
let result = db.createItem(collection, obj);
console.log(result);
