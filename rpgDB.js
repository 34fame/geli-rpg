import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

const db = new JsonDB(new Config("rpg", true, true, "/"));

exports.getItems = (collection) => {
  return db.getData(`/${collection}`);
};

exports.getItem = (collection, id) => {
  return db.getData(`/${collection}/${id}`);
};

exports.createItem = (collection, obj) => {
  try {
    db.push(collection, obj);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.updateItem = (collection, obj) => {
  try {
    db.push(`/${collection}/${obj.id}`, obj, false);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.deleteItem = (collection, id) => {
  try {
    db.delete(`/${collection}/${id}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// db.push("/arraytest/myarray[0]", {
//    obj:'test'
// }, true);

// var testString = db.getData("/arraytest/myarray[0]/obj");

// db.delete("/arraytest/myarray[0]");

// db.push("/arraytest/myarray[]", {
//    obj:'test'
// }, true);

// db.push("/arraytest/myarray[]/myTest", 'test', true);

// let numberOfElement = db.count("/arraytest/myarray");

// db.push("/arraytest/myarray", {id: 65464646155, name: "test"}, true);
// db.getIndex("/arraytest/myarray", 65464646155);
// db.getIndex("/arraytest/myarray", "test", "name");

// db.delete("/arraytest/myarray[" + db.getIndex("/arraytest/myarray", 65464646155) + "]");

// db.push("/arraytest/lastItemArray", [1, 2, 3], true);

// db.getData("/arraytest/lastItemArray[-1]");

// db.delete("/arraytest/lastItemArray[-1]");

// db.getData("/arraytest/lastItemArray[-1]");
