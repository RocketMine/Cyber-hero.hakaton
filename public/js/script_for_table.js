document.addEventListener('DOMContentLoaded', function () {
    const usersTable = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
  
    // Загрузка данных из файла (замените на ваш код загрузки данных)
    fetch('json/results.json')
      .then(response => response.json())
      .then(data => {
        // Сортировка результатов по убыванию баллов
        const sortedResults = data.sort((a, b) => b.score - a.score);
  
        // Отображение первых пяти результатов
        const topFiveResults = sortedResults.slice(0, 5);
  
        topFiveResults.forEach((result, index) => {
          const row = usersTable.insertRow();
          const placeCell = row.insertCell(0);
          const nameCell = row.insertCell(1);
          const scoreCell = row.insertCell(2);
        
          placeCell.textContent = index + 1;
          nameCell.textContent = result.userName;
          scoreCell.textContent = result.score;
        
          placeCell.classList.add('table-cell');
          nameCell.classList.add('table-cell');
          scoreCell.classList.add('table-cell');
        });
      })
      .catch(error => console.error('Ошибка загрузки данных:', error.message));
  });
  