// DOM elements
let timerEl = document.querySelector("#time");
let choiceEl = document.querySelector("#option");
let subBtn = document.querySelector("#submit");
let replyEl = document.querySelector("#reply");
let startBtn = document.querySelector("#begin");
let questionsEl = document.querySelector("#questions");
let initialsEl = document.getElementById("initials");

// functions
let currentQuestionsIndex = 0;
let time = questions.length * 30;
let timerId;

function beginQuiz() {
  // hidden at begin screen
  let beginScreenEl = document.getElementById("main-page");
  beginScreenEl.setAttribute("class", "hide");

  // show questions section
  questionsEl.removeAttribute("class");

  // begin timer
  timerId = setInterval(clockTick, 1000);

  // show begining time
  timerEl.textContent = time;

  getQuestions();
}

function getQuestions() {
  // questions from array
  console.log("questions", questions);
  let currentQuestions = questions[currentQuestionsIndex];

  // New question
  let titleEl = document.getElementById("questions-title");
  titleEl.textContent = currentQuestions.title;

  // replace old question with new
  choiceEl.innerHTML = "";

  // loop over Multiple Question Choice
  currentQuestions.option.forEach(function (option, i) {
    // create new button for each choice selection
    let choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "option");
    choiceNode.setAttribute("value", option);

    choiceNode.textContent = i + 1 + ". " + option;

    // attach click event listener to each Anwser
    choiceNode.onclick = questionsClick;

    // display on the page
    choiceEl.appendChild(choiceNode);
  });
}

function questionsClick() {
  // check if user guessed wrong
  if (this.value !== questions[currentQuestionsIndex].answer) {
    // penalize time
    time -= 15;

    if (time < 0) {
      time = 0;
    }
    // Display updated time on page
    timerEl.textContent = time;
    replyEl.textContent = "Wrong!";
    replyEl.style.color = "red";
    replyEl.style.fontSize = "400%";
  } else {
    replyEl.textContent = "Correct!";
    replyEl.style.color = "green";
    replyEl.style.fontSize = "400%";
  }

  // Display Correct or Incorrect Reply
  replyEl.setAttribute("class", "reply");
  setTimeout(function () {
    replyEl.setAttribute("class", "reply hide");
  }, 500);

  // Next Multiple Choice Question
  currentQuestionsIndex++;

  // Time check
  if (currentQuestionsIndex === questions.length) {
    endQuiz();
  } else {
    getQuestions();
  }
}

function endQuiz() {
  // End timer
  clearInterval(timerId);

  // display last end page
  let endPageElement = document.getElementById("end-page");
  endPageElement.removeAttribute("class");

  // show final score
  let finalScoreElement = document.getElementById("final-score");
  finalScoreElement.textContent = time;

  // hide questions section
  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  // update time
  time--;
  timerEl.textContent = time;

  // check if user ran out of time
  if (time <= 0) {
    endQuiz();
  }
}

function saveTopscore() {
  // Record value input
  let initials = initialsEl.value.trim();

  console.log('initials', initials);

  if (initials !== "") {
    console.log('initials', initials);
    // Saved scores from localstorage, or if not any, set to empty array
    let topscores = JSON.parse(window.localStorage.getItem("topscores")) || [];
    console.log('topscores 1', topscores);
    // Create new score object for current user
    let newScore = {
      score: time,
      initials: initials,
    };

    // save to localstorage
    topscores.push(newScore);
    console.log('topscores 2', topscores);
    window.localStorage.setItem("topscores", JSON.stringify(topscores));

    // Move to next display page
    window.location.href = "topscore.html";
  }
}

function checkForEnter(event) {
  // represents the enter key
  if (event.key === "Enter") {
    saveTopscore();
  }
}

// submit initials
subBtn.addEventListener("click", saveTopscore);

// begin quiz


startBtn.addEventListener("click", beginQuiz);

initialsEl.onkeyup = checkForEnter;

// Scores JS functions