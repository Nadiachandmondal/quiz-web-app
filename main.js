const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');

hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  sidebar.classList.toggle('open');

  // Smoothly hide hamburger
  if (sidebar.classList.contains('open')) {
    hamburger.classList.add('hidden');
  }
});

document.addEventListener('click', (e) => {
  const clickedInsideSidebar = sidebar.contains(e.target);
  const clickedHamburger = hamburger.contains(e.target);

  if (!clickedInsideSidebar && !clickedHamburger && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    hamburger.classList.remove('hidden');
  }
});

// --- Quiz functionality with Loader ---

const mainDiv = document.getElementById('main-div');
const nextBtn = document.getElementById('next-btn');
const loader = document.getElementById('loader');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const selectedSubject = localStorage.getItem('selectedSubject') || 'Mathematics';

async function fetchQuestions(subject) {
  const categoryMap = {
    "Mathematics": 19,
    "Science": 17,
    "History": 23,
    "Geography": 22,
    "English": 9,
    "Literature": 10,
    "Art": 25,
    "Technology": 18,
    "Sports": 21
  };

  const categoryId = categoryMap[subject] || 9;
  const selectedDifficulty =
  localStorage.getItem('selectedDifficulty') || 'medium';

const url = `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${selectedDifficulty}&type=multiple`;

  try {
    loader.classList.remove('hidden');
    const res = await fetch(url);
    const data = await res.json();
    loader.classList.add('hidden');
    return data.results;
  } catch (error) {
    loader.classList.add('hidden');
    console.error("Error fetching questions:", error);
    return [];
  }
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function showQuestion(index) {
  if (questions.length === 0) {
    mainDiv.innerHTML = "<p>No questions found for this subject.</p>";
    nextBtn.style.display = 'none';
    return;
  }

  if (index >= questions.length) {
    mainDiv.innerHTML = `
      <h2>Quiz Complete!</h2>
      <p>Your score: <strong>${score} / ${questions.length}</strong></p>
      <button id="restart-btn">Restart Quiz</button>
    `;
    nextBtn.style.display = 'none';

    const restartBtn = document.getElementById('restart-btn');
    restartBtn.addEventListener('click', () => {
      currentQuestionIndex = 0;
      score = 0;
      nextBtn.style.display = 'inline-block';
      showQuestion(currentQuestionIndex);
    });

    return;
  }

  const q = questions[index];
  let answers = [...q.incorrect_answers];
  answers.splice(Math.floor(Math.random() * (answers.length + 1)), 0, q.correct_answer);

  mainDiv.innerHTML = `
    <h2>Question ${index + 1}</h2>
    <p>${decodeHTML(q.question)}</p>
    <form id="quiz-form">
      ${answers.map((ans, i) => `
        <div>
          <input type="radio" name="answer" id="answer${i}" value="${decodeHTML(ans)}" required>
          <label for="answer${i}">${decodeHTML(ans)}</label>
        </div>
      `).join('')}
    </form>
  `;
}

nextBtn.addEventListener('click', () => {
  const form = document.getElementById('quiz-form');
  if (!form) return;

  const selectedOption = form.answer.value;
  if (!selectedOption) {
    alert('Please select an answer before proceeding!');
    return;
  }

  if (selectedOption === decodeHTML(questions[currentQuestionIndex].correct_answer)) {
    score++;
  }

  currentQuestionIndex++;
  showQuestion(currentQuestionIndex);
});

window.addEventListener('DOMContentLoaded', async () => {
  loader.classList.remove('hidden');
  questions = await fetchQuestions(selectedSubject);
  loader.classList.add('hidden');
  showQuestion(currentQuestionIndex);
});

// Handle subject button clicks
document.querySelectorAll('.subject-btn').forEach(button => {
  button.addEventListener('click', async () => {
    const selected = button.textContent.trim();
    localStorage.setItem('selectedSubject', selected);

    // Reset state
    currentQuestionIndex = 0;
    score = 0;

    // Show loader
    mainDiv.innerHTML = `
      <div id="loader" class="loader">
    <img src="loading.gif" alt="Loading..." class="loader-gif" />
        <p>Loading question...</p>
      </div>
    `;
    nextBtn.style.display = 'none';

    // Fetch questions
    questions = await fetchQuestions(selected);

    // Show first question
    showQuestion(currentQuestionIndex);
    nextBtn.style.display = 'inline-block';

    // Close sidebar & show hamburger again
    sidebar.classList.remove('open');
    hamburger.classList.remove('hidden');
  });
});
