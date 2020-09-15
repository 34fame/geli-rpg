const query = require("cli-interact");

const respond = (answer) => {
  console.log("you answered:", answer);
};

const QUESTIONS = [
  {
    type: "getYesNo",
    text: "Are you sure?",
  },
  {
    type: "getChar",
    text: "Choose an options?",
    options: "abcd",
  },
  {
    type: "getChoiceByChar",
    text: "Choose frequency",
    options: ["daily", "weekly", "monthly"],
  },
  {
    type: "getNumber",
    text: "How old are you?",
    options: true,
  },
  {
    type: "question",
    text: "Whats your name?",
  },
];

QUESTIONS.map((q) => {
  respond(query[q.type](q.text, q.options));
});
