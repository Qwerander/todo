(function () {
  let todoArray = [];
  let idNumber
  let listName = '';

  // создаем и возвращаем зоголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    document.addEventListener('input', function() {
      if (input.value) {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    });

    return {
      form,
      input,
      button,
    };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(myCase) {
    let item = document.createElement('li');
    // кнопки помещаем в элементб который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // устанавливаем стили для элеммента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = myCase.name;
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';
    if (myCase.done === true) {
      item.classList.add('list-group-item-success');
    }

    // добавляем обработчики на кнопки

    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');
      for (const eachCase of todoArray) {
        if (eachCase.id === myCase.id) {
          eachCase.done = !eachCase.done
        }
      }
      saveList(todoArray, listName);
    });

    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();
        for ( let i = 0; i < todoArray.length; ++i) {
          if (todoArray[i].id === myCase.id) {
            todoArray.splice(i, 1);
          }
        }
        saveList(todoArray, listName);
      }
    });

    // вкладываем кнопки в отдельный элемент, чтобы они объеденились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);


    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function saveList(arr, caseWho) {
    localStorage.setItem(caseWho, JSON.stringify(arr));
  }

  function createTodoApp(container, title = 'Список дел', caseWho, defaultCase = []) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    listName = caseWho;
    todoArray = defaultCase;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem(listName);

    if (localData !== null && localData !== '') {
      todoArray = JSON.parse(localData);
    };


    for (const listItem of todoArray) {
      let todoItem = createTodoItem(listItem);
      todoList.append(todoItem.item);
    };

    // браузер создает событие submit на форме по нажатию Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) {
      // эта строчка необходима, чтобы передавать стандартное действие браузера
      // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      }


      if (todoArray[todoArray.length - 1]) {
        idNumber = todoArray[todoArray.length - 1].id;
      } else idNumber = 0
      ++idNumber;

      let newItem = {
        id: idNumber,
        name: todoItemForm.input.value,
        done: false,
      }

      let todoItem = createTodoItem(newItem);

      todoArray.push(newItem);
      saveList(todoArray, listName);
      console.log(localStorage);
      // создаем  и добавляем в список новое дело с названием из поля для ввода

      todoList.append(todoItem.item);
      // обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    });
  }

  window.createTodoApp = createTodoApp;
})();
