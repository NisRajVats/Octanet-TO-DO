document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const dueDateInput = document.getElementById('due-date');
    const prioritySelect = document.getElementById('priority');
    const addTaskBtn = document.getElementById('add-task');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let tasks = [];

    addTaskBtn.addEventListener('click', addTask);
    filterBtns.forEach(btn => btn.addEventListener('click', filterTasks));

    function addTask() {
        const taskName = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = prioritySelect.value;

        if (taskName === '') return;

        const task = {
            id: Date.now(),
            name: taskName,
            dueDate,
            priority,
            completed: false,
        };

        tasks.push(task);
        taskInput.value = '';
        dueDateInput.value = '';
        prioritySelect.value = 'low';

        renderTasks();
    }

    function renderTasks(filter = 'all') {
        todoList.innerHTML = '';

        const filteredTasks = tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
        });

        filteredTasks.forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.className = task.completed ? 'completed' : 'pending';

            const taskDetails = document.createElement('div');
            taskDetails.className = 'task-details';
            taskDetails.innerHTML = `
                <span>${task.name}</span>
                <span class="priority">Due: ${task.dueDate || 'No date'}, Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
            `;

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';
            taskActions.innerHTML = `
                <button onclick="toggleComplete(${task.id})">Complete</button>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            `;

            taskElement.appendChild(taskDetails);
            taskElement.appendChild(taskActions);

            todoList.appendChild(taskElement);
        });
    }

    function toggleComplete(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                task.completed = !task.completed;
            }
            return task;
        });

        renderTasks();
    }

    function editTask(id) {
        const task = tasks.find(task => task.id === id);

        if (task) {
            taskInput.value = task.name;
            dueDateInput.value = task.dueDate;
            prioritySelect.value = task.priority;

            tasks = tasks.filter(task => task.id !== id);

            renderTasks();
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }

    function filterTasks(e) {
        const filter = e.target.getAttribute('data-filter');
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderTasks(filter);
    }

    window.toggleComplete = toggleComplete;
    window.editTask = editTask;
    window.deleteTask = deleteTask;
});
