const completedAllBtnElem = document.querySelector('.completed-all-btn');
const todoInputElem = document.querySelector('.todo-input');
const todoListElem = document.querySelector('.todo-list');
const leftItemsElem = document.querySelector('.left-items');
const showAllBtnElem = document.querySelector('.show-all-btn');
const showActiveBtnElem = document.querySelector('.show-active-btn');
const showCompletedBtnElem = document.querySelector('.show-completed-btn');
const clearCompletedBtnElem = document.querySelector('.clear-completed-btn');

let todos = [];
let id = 0;
let isAllCompleted = false;
let currentShowType = 'all';

// <--sectionDB-->

const getAllTodos = () => {
    return todos;
}

const getActiveTodos = () => {
    return todos.filter(todo => todo.isCompleted === false);
}

const getCompletedTodos = () => {
    return todos.filter(todo => todo.isCompleted === true);
}

const setTodos = (newTodos) => {
    todos = newTodos;
}

// <--setShowType-->

const setShowType = (newShowType) => { currentShowType = newShowType};

const onClickShowType  = (event) => {
    const currentBtnElem = event.target;
    const newShowType = currentBtnElem.dataset.type;

    if(currentShowType === newShowType) return;

    const preBtnElem = document.querySelector(`.show-${currentShowType}-btn`);
    preBtnElem.classList.remove('selected');

    currentBtnElem.classList.add('selected');

    setShowType(newShowType);
    paintTodos();
}

// <--CRUD-->

const createTodo = (text) => {
    const newId = id++;
    const newTodos = [...getAllTodos(), {id: newId, isCompleted: false, content: text}];
    setTodos(newTodos);

    setLeftItems();
    checkIsAllCompleted();
    paintTodos();
}

const deleteTodo = (todoId) => {
    const newTodos = getAllTodos().filter(todo => todo.id !== todoId);
    setTodos(newTodos);

    setLeftItems();
    checkIsAllCompleted();
    paintTodos();
}

const completedTodo = (todoId) => {
    const newTodos = getAllTodos().map(todo =>  todo.id === todoId ? ({...todo, isCompleted: !todo.isCompleted}) : todo);
    setTodos(newTodos);

    setLeftItems();
    checkIsAllCompleted();
    paintTodos();
}

const onDblclickTodo = (event, todoId) => {
    const todoElem = event.target;
    const inputText = todoElem.innerText;
    const todoItemElem = todoElem.parentNode;
    const inputElem = document.createElement('input');

    inputElem.value = inputText;
    inputElem.classList.add('edit-input');

    inputElem.addEventListener('keypress', (event) => {
        if(event.key === "Enter") {
            updateTodo(inputElem.value, todoId);
            document.body.removeEventListener('click', onClickBody);
        }
    })

    const onClickBody = (event) => {
        if(event.target !== inputElem) {
            updateTodo(inputElem.value, todoId);
            document.body.removeEventListener('click', onClickBody);
        }
    }

    document.body.addEventListener('click', onClickBody);
    todoItemElem.appendChild(inputElem);
}

const updateTodo = (text, todoId) => {
    const newTodos = getAllTodos().map(todo => todo.id === todoId ? ({...todo, content: text}) : todo);
    setTodos(newTodos);
    paintTodos();
}
// <--allCompleted-->

const setIsAllCompleted = (bool) => {isAllCompleted = bool};

const checkIsAllCompleted = () => {
    if(getAllTodos().length === getCompletedTodos().length) {
        completedAllBtnElem.classList.add('checked');
        setIsAllCompleted(true);
    } else {
        completedAllBtnElem.classList.remove('checked');
        setIsAllCompleted(false);
    }
}

const onClickCompletedAll = () => {
    if(!getAllTodos().length) return;

    if(isAllCompleted) {
        incompletedAll();
    } else {
        completedAll();
    }

    setLeftItems();
    checkIsAllCompleted();
    paintTodos();
}

const completedAll = () => {
    const newTodos = getAllTodos().map(todo => ({...todo, isCompleted: true}));
    setTodos(newTodos);
}

const incompletedAll = () => {
    const newTodos = getAllTodos().map(todo => ({...todo, isCompleted: false}));
    setTodos(newTodos);
}

// <--paintTodos-->

const paintTodos = () => {
    todoListElem.innerHTML = null;

    switch (currentShowType) {
        case 'all':
            getAllTodos().forEach(todo => {paintTodo(todo)});
            break;

        case 'active':
            getActiveTodos().forEach(todo => {paintTodo(todo)});
            break;

        case 'completed':
            getCompletedTodos().forEach(todo => {paintTodo(todo)});
            break;
        
        default:
            break;
    }
}


const paintTodo = (todo) => {

        const todoItemElem = document.createElement('div');
        todoItemElem.classList.add('todo-item');
        todoItemElem.setAttribute('data-id', todo.id);

        const checkboxElem = document.createElement('div');
        checkboxElem.classList.add('checkbox');
        checkboxElem.addEventListener('click', () => completedTodo(todo.id));

        const todoElem = document.createElement('div');
        todoElem.classList.add('todo');
        todoElem.addEventListener('dblclick', (event) => onDblclickTodo(event, todo.id));
        todoElem.innerText = todo.content;

        const delBtnElem = document.createElement('button');
        delBtnElem.classList.add('del-btn');
        delBtnElem.addEventListener('click', () => deleteTodo(todo.id));
        delBtnElem.innerText = 'delete';

        if(todo.isCompleted) {
            todoItemElem.classList.add('checked');
            checkboxElem.innerText = "V";
        }

        todoItemElem.appendChild(checkboxElem);
        todoItemElem.appendChild(todoElem);
        todoItemElem.appendChild(delBtnElem);

        todoListElem.appendChild(todoItemElem);
}


// <--clear-->

const clearCompletedTodos = () => {
    const newTodos = getActiveTodos();
    setTodos(newTodos);

    setLeftItems();
    checkIsAllCompleted();
    paintTodos();
}

const setLeftItems = () => {
    const leftItems = getActiveTodos();
    leftItemsElem.innerText = `${leftItems.length} items left`;
}


const init = () => {
    todoInputElem.addEventListener('keypress', (event) => {
        if(event.key === "Enter") {
                createTodo(event.target.value);
                todoInputElem.value = '';
            }
    });

    showAllBtnElem.addEventListener('click', onClickShowType);
    showActiveBtnElem.addEventListener('click', onClickShowType);
    showCompletedBtnElem.addEventListener('click', onClickShowType);

    completedAllBtnElem.addEventListener('click', onClickCompletedAll);

    clearCompletedBtnElem.addEventListener('click', clearCompletedTodos);

    setLeftItems();
}

init();