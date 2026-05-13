// Fill Age Groups
const ageGroupSelect = document.getElementById('age-group');
const ageGroups = [
    "Under 10", "10-13", "14-17", "18-21", "22-30", "31 and above"
];

ageGroups.forEach(group => {
    const option = document.createElement('option');
    option.value = group;
    option.textContent = group;
    ageGroupSelect.appendChild(option);
});

// Fill Subjects
const subjectSelect = document.getElementById('subject');
const subjects = [
  "Mathematics", "Science", "History", "Geography", "Literature", "Art", "Technology", "Sports"
];


subjects.forEach(subject => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    subjectSelect.appendChild(option);
});

const doneBtn = document.getElementById('done-btn');

doneBtn.addEventListener('click', () => {
  const ageGroup = ageGroupSelect.value;
  const subject = subjectSelect.value;

  if (ageGroup && subject) {
    // Save selected age group and subject in localStorage
    localStorage.setItem('selectedAgeGroup', ageGroup);
    localStorage.setItem('selectedSubject', subject);

    let difficulty = 'medium';

if (ageGroup === 'Under 10') {
  difficulty = 'easy';
} else if (ageGroup === '10-13' || ageGroup === '14-17') {
  difficulty = 'medium';
} else {
  difficulty = 'hard';
}

localStorage.setItem('selectedDifficulty', difficulty);


    // Navigate to main.html
    window.location.href = "main.html";
  } else {
    alert("Please select both age group and subject.");
  }
});

// BELOW CODE IS USED IN main.html TO FETCH QUESTIONS BASED ON AGE & SUBJECT

// Check if we are on main.html before running fetch logic
if (window.location.pathname.includes("main.html")) {
  const selectedSubject = localStorage.getItem('selectedSubject') || 'Mathematics';
  const selectedAgeGroup = localStorage.getItem('selectedAgeGroup') || '14-17';

  // Determine difficulty based on age group
  let difficulty = 'medium';
  if (selectedAgeGroup === 'Under 10') {
    difficulty = 'easy';
  } else if (['10-13', '14-17'].includes(selectedAgeGroup)) {
    difficulty = 'medium';
  } else {
    difficulty = 'hard';
  }

  // Fetch questions based on subject and difficulty
  async function fetchQuestions(subject) {
    const categoryMap = {
      "Mathematics": 19,
      "Science": 17,
      "History": 23,
      "Geography": 22,
      "Literature": 10,
      "Art": 25,
      "Technology": 18,
      "Sports": 21
    };

    const categoryId = categoryMap[subject] || 9;

    const url = `https://opentdb.com/api.php?amount=5&category=${categoryId}&difficulty=${difficulty}&type=multiple`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching questions:", error);
      return [];
    }
  }

  // Example usage
  fetchQuestions(selectedSubject).then(questions => {
    console.log("Fetched Questions:", questions);
    // You can call your render/display function here like:
    // displayQuestions(questions);
  });
}

