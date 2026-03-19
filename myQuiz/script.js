// DOM elements
const startScreen = document.querySelector("#start-screen");
const quizScreen = document.querySelector("#quiz-screen");
const resultScreen = document.querySelector("#result-screen");
const startButton = document.querySelector("#start-btn");
const questionText = document.querySelector("#question-text");
const answerContainer = document.querySelector("#answers-container");
const currentQuestionSpan = document.querySelector("#current-question");
const totalQuestionsSpan = document.querySelector("#total-questions");
const scoreSpan = document.querySelector("#score");
const finalScoreSpan = document.querySelector("#final-score");
const maxScoreSpan = document.querySelector("#max-score");
const resultMessage = document.querySelector("#result-message");
const restartButton = document.querySelector("#restart-btn");
const progressBar = document.querySelector("#progress");

const quizQuestions = [
  {
    question: "Vilken är Sveriges största kommun till ytan?",
    answers: [
      { text: "Kiruna kommun", correct: true },
      { text: "Gällivare kommun", correct: false },
      { text: "Gotland", correct: false },
      { text: "Jokkmokks kommun", correct: false },
    ],
  },
  {
    question: "Vilken är Sveriges största sjö?",
    answers: [
      { text: "Vättern", correct: false },
      { text: "Vänern", correct: true },
      { text: "Mälaren", correct: false },
      { text: "Storsjön", correct: false },
    ],
  },
  {
    question: "Hur många landskap finns det i Sverige?",
    answers: [
      { text: "23", correct: false },
      { text: "27", correct: false },
      { text: "25", correct: true },
      { text: "29", correct: false },
    ],
  },
  {
    question: "Vilken är den mest förekommande trädsorten i Skåne?",
    answers: [
      { text: "Tall", correct: false },
      { text: "Bok", correct: true },
      { text: "Gran", correct: false },
      { text: "Björk", correct: false },
    ],
  },
  {
    question: "Hur många öar finns det i Sverige?",
    answers: [
      { text: "ca 120 000", correct: false },
      { text: "ca 200 000", correct: false },
      { text: "ca 270 000", correct: true },
      { text: "ca 180 000", correct: false },
    ],
  },
  {
    question: "Vilket är Svealands högsta berg?",
    answers: [
      { text: "Tallmossen", correct: false },
      { text: "Lustigknopp", correct: false },
      { text: "Stora Korpimäki", correct: false },
      { text: "Storvätteshågna", correct: true },
    ],
  },
  {
    question: "Hur många procent av Sveriges yta är täckt av skog?",
    answers: [
      { text: "ca 50%", correct: false },
      { text: "ca 60%", correct: false },
      { text: "ca 70%", correct: true },
      { text: "ca 80%", correct: false },
    ],
  },
  {
    question: "Vilket är Sveriges högsta vattenfall?",
    answers: [
      { text: "Njupeskär", correct: true },
      { text: "Stora Sjöfallet", correct: false },
      { text: "Tännforsen", correct: false },
      { text: "Fettjeåfallet", correct: false },
    ],
  },
  {
    question: "Hur många domkyrkor finns det i Sverige?",
    answers: [
      { text: "13", correct: false },
      { text: "15", correct: true },
      { text: "16", correct: false },
      { text: "18", correct: false },
    ],
  },
  {
    question: "Vilken är Sveriges längsta väg?",
    answers: [
      { text: "E4", correct: false },
      { text: "E20", correct: false },
      { text: "E18", correct: false },
      { text: "E45", correct: true },
    ],
  },
];

// Quiz state variables
let currentQuestionIndex = 0;
let score = 0;
// to prevent multiple answers for the same question
let answersDisabled = false;

totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// Event listeners
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

function startQuiz() {
  // reset variables
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  // switching the active screen
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  // function to show the question
  showQuestion();
}

function showQuestion() {
  // reset state
  answersDisabled = false;

  const currentQuestion = quizQuestions[currentQuestionIndex];

  // updating the question index
  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  // updating the progressbar
  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";

  // the question
  questionText.textContent = currentQuestion.question;

  // the answerbuttons
  answerContainer.innerHTML = ""; // so that the questions don´t "stack" on eachother
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    // dataset store custom data
    button.dataset.correct = answer.correct;

    button.addEventListener("click", selectAnswer);
    answerContainer.appendChild(button);
  });
}

function selectAnswer(event) {
  // if answers are disabled, do nothing
  if (answersDisabled) return;

  // disable answers to prevent multiple answers for the same question
  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  // converting answerContainer.children to an array to be able to use the forEach method
  Array.from(answerContainer.children).forEach((button) => {
    // adding correct class to correct answer and incorrect class to the selected wrong answer
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });
  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  // a delay before next question
  setTimeout(() => {
    currentQuestionIndex++;
    // checking if there is more questions
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1000);
}

function showResults() {
  // change the active screen to the result screen
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;
  const percentage = (score / quizQuestions.length) * 100;

  if (percentage === 100) {
    resultMessage.textContent = "Perfekt! Du är ett geni!";
  } else if (percentage >= 80) {
    resultMessage.textContent =
      "Bra jobbat! Du har mycket bra kunskap om Sverige!";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Inte illa! Du har bra kunskap om Sverige!";
  } else if (percentage >= 40) {
    resultMessage.textContent = "Du har hyfsad kunskap om Sverige!";
  } else {
    resultMessage.textContent = "Du har en del att lära dig om Sverige!";
  }
}

function restartQuiz() {
  resultScreen.classList.remove("active");
  // go back to the start screen
  startScreen.classList.add("active");
  // or start the quiz right away
  //startQuiz();
}
