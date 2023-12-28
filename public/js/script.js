document.addEventListener("DOMContentLoaded", function () {
    // получаем текущий путь страницы
    var path = window.location.pathname;
  
    // получаем имя файла из пути
    var currentPage = path.split("/").pop();
  
    // получаем все элементы навигации
    var navItems = document.querySelectorAll(".navbar-nav .nav-item");
  
    // перебираем элементы и устанавливаем класс "active" для соответствующего элемента
    navItems.forEach(function (item) {
      var link = item.querySelector("a");
      var href = link.getAttribute("href");
      if (currentPage === href) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  });
  