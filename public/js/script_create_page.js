// Получаем строку запроса из URL
const queryString = window.location.search;
// Создаем объект для работы с параметрами запроса
const urlParams = new URLSearchParams(queryString);
// Получаем значение параметра 'data' из URL
const num_test = urlParams.get('data');

// Путь к вашему JSON-файлу на сервере
const jsonFilePath = 'json/tests.json';

// Функция для получения правильных ответов по номеру теста
function getCorrectAnswers(testNumber, testsData) {
  const key_test = 'num_test_' + testNumber;
  return fetch(jsonFilePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Не удалось выполнить запрос. Статус: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (!(key_test in data)) {
        console.error(`Тест с индексом ${key_test} не найден.`);
        return [];
      }

      const test = data[key_test];

      if (!test || !test.questions) {
        console.error(`Данные для теста ${key_test} не корректны.`);
        return [];
      }

      return test.questions
        .filter(question => question.correct_option !== undefined && question.correct_option !== -1)
        .map(question => question.correct_option);
    });
}

function createTest(NumTest) {
  const key_test = 'num_test_' + NumTest;

  fetch(jsonFilePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Не удалось выполнить запрос. Статус: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const test = data[key_test];
      if (!test) {
        throw new Error(`Тест с индексом ${key_test} не найден.`);
      }

      const testContainer = document.getElementById('testContainer');
      if (!testContainer) {
        throw new Error('Элемент с id "testContainer" не найден.');
      }

      const fragment = document.createDocumentFragment();

      test.questions.forEach((question, i) => {
        const container = document.createElement('div');
        container.classList.add('container', 'mt-4');

        const heading = document.createElement('h3');
        heading.textContent = question.text;

        container.appendChild(heading);

        question.options.forEach((option, j) => {
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = i;
          input.value = j;
          input.id = `option${j + i * 3}`;

          const label = document.createElement('label');
          label.textContent = option;
          label.htmlFor = `option${j + i * 3}`;

          const paragraph = document.createElement('p');
          paragraph.appendChild(input);
          paragraph.appendChild(label);

          // Добавляем отступ между радиокнопкой и текстом
          input.style.marginRight = '8px';

          container.appendChild(paragraph);
        });

        fragment.appendChild(container);
      });

      const submitButton = document.createElement('button');
      submitButton.classList.add('btn', 'btn-primary');
      submitButton.textContent = 'Завершить тест';
      submitButton.addEventListener('click', submitTest);

      fragment.appendChild(document.createElement('br'));
      fragment.appendChild(document.createElement('center'));
      fragment.lastElementChild.appendChild(submitButton);
      fragment.appendChild(document.createElement('br'));

      testContainer.innerHTML = `</br><center><h2>${test['name']}</h2></center>`;
      testContainer.appendChild(fragment);
    })
    .catch(error => console.error('Ошибка загрузки данных:', error.message));
}


// Функция для подсчета количества совпадений элементов в двух массивах
function countMatchingElements(arr1, arr2) {
  var count = 0
  for (let i = 0; i<arr1.length;i++){
    if (arr1[i] == arr2[i]){
      count++;
    }
  }
  return count
}

// Функция для обработки завершения теста и получения результатов
function getUserAnswers() {
  const testContainer = document.getElementById('testContainer');
  if (!testContainer) {
    console.error('Элемент с id "testContainer" не найден.');
    return [];
  }
  return Array.from(testContainer.querySelectorAll('input[type=radio]:checked')).map(element => element.value);
}

function displayResults(userAnswers, correctAnswers, result) {
  console.log('Верные ответы:', correctAnswers);
  console.log('Ответы пользователя:', userAnswers);
  console.log('Отценка пользователя:', result);

  openPopupWithInput(`Ваш результат: ${result}`);
}

function openPopup(message) {
  const overlay = document.getElementById('overlay');
  const customDialog = document.getElementById('customDialog');
  const popupMessage = document.getElementById('popupMessage');

  popupMessage.textContent = message;
  overlay.style.display = 'block';
  customDialog.style.display = 'block';
}

function closePopup() {
  const overlay = document.getElementById('overlay');
  const customDialog = document.getElementById('customDialog');

  overlay.style.display = 'none';
  customDialog.style.display = 'none';
}

function saveResults(userName, score) {
  const testResults = { userName, score };

  fetch('/saveResult', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testResults),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Не удалось сохранить результат. Статус: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Результат успешно сохранен:', data);
      openPopupWithInput(`Результат успешно сохранен: ${score}`);
    })
    .catch(error => {
      console.error('Ошибка сохранения результатов:', error.message);
    });
}

function submitTest() {
  const userAnswers = getUserAnswers();
  if (userAnswers.length === 0) {
    alert('Вы ответили не на все вопросы!');
    return;
  }

  getCorrectAnswers(num_test)
    .then(correctAnswers => {
      if (userAnswers.length !== correctAnswers.length) {
        alert('Вы ответили не на все вопросы!');
        return;
      }

      const result = countMatchingElements(correctAnswers, userAnswers);
      displayResults(userAnswers, correctAnswers, result);
    })
    .catch(error => console.error('Ошибка получения правильных ответов:', error.message));
}

function saveResultsFromPopup() {
  const userNameInput = document.getElementById('userNameInput');
  const userName = userNameInput.value.trim();
  const userAnswers = getUserAnswers();
  if (userName === '') {
    alert('Введите ваше имя перед сохранением результатов.');
    return;
  }
  getCorrectAnswers(num_test)
    .then(correctAnswers => {
      const result = countMatchingElements(correctAnswers, userAnswers);
      saveResults(userName, result);
    })
  
}

function openPopupWithInput(message) {
  const overlay = document.getElementById('overlay');
  const customDialog = document.getElementById('customDialog');
  const popupMessage = document.getElementById('popupMessage');
  const userNameInput = document.getElementById('userNameInput');

  popupMessage.textContent = message;
  userNameInput.value = ''; // Очищаем поле ввода имени
  overlay.style.display = 'block';
  customDialog.style.display = 'block';
}

// Ожидаем полной загрузки DOM и вызываем функцию создания теста
document.addEventListener('DOMContentLoaded', () => {
  createTest(String(num_test));
});