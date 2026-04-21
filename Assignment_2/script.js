
let tasks = [];
let currentFilter = 'All'; 
let currentSort = 'Priority';


const taskInput = document.getElementById('task');
const deadlineInput = document.getElementById('taskDate');
const priorityInput = document.getElementById('priority');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskListContainer = document.getElementById('TaskList');
const sortTasksSelect = document.getElementById('sortTasks');
const filterButtons = document.querySelectorAll('.btn-group .btn');

const totalTasksEl = document.getElementById('TotalTasks');
const completedTasksEl = document.getElementById('CompletedTasks');
const pendingTasksEl = document.getElementById('PendingTasks');

const priorityWeights = { 'High': 3, 'Medium': 2, 'Low': 1 };

const priorityBadgeColors = {
    'High': 'bg-danger',
    'Medium': 'bg-warning text-dark',
    'Low': 'bg-success'
};

const priorityBorderColors = {
    'High': 'border-danger',
    'Medium': 'border-warning',
    'Low': 'border-success'
};

function debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function addTask() {
    const title = taskInput.value.trim();
    const deadline = deadlineInput.value;
    const priority = priorityInput.value;

    if (!title) {
        alert("Please enter a task name.");
        return;
    }
    if (!deadline) {
        alert("Please select a deadline.");
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        title: title,
        deadline: deadline,
        priority: priority,
        completed: false
    };

    tasks.push(newTask);
    
    taskInput.value = '';
    deadlineInput.value = '';
    priorityInput.value = 'Low';

    updateUI();
}

function toggleComplete(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    updateUI();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    updateUI();
}

function renderTasks() {
    let processedTasks = tasks.filter(task => {
        if (currentFilter === 'Completed') return task.completed;
        if (currentFilter === 'Pending') return !task.completed;
        return true;
    });

    processedTasks.sort((a, b) => {
        if (currentSort === 'Priority') {
            return priorityWeights[b.priority] - priorityWeights[a.priority];
        } else if (currentSort === 'Deadline') {
            return new Date(a.deadline) - new Date(b.deadline);
        }
        return 0;
    });

    const totalCount = tasks.length;
    const completedCount = tasks.filter(t => t.completed).length;
    const pendingCount = totalCount - completedCount;

    totalTasksEl.textContent = totalCount;
    completedTasksEl.textContent = completedCount;
    pendingTasksEl.textContent = pendingCount;

    taskListContainer.innerHTML = ''; 

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    processedTasks.forEach(task => {
        const taskDate = new Date(task.deadline);
        const isOverdue = (taskDate < today) && !task.completed;
        let specificBorderColor = priorityBorderColors[task.priority]; 

        if (task.completed) {
            specificBorderColor = 'border-success'; 
        } else if (isOverdue) {
            specificBorderColor = 'border-danger'; 
        }

        const cardClasses = `border border-2 ${specificBorderColor}`;
        
        const titleClasses = task.completed ? "text-decoration-line-through text-muted" : "";
        
        const taskElement = document.createElement('div');
        taskElement.className = `card shadow-sm ${cardClasses}`;
        taskElement.innerHTML = `
            <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                    <h5 class="card-title mb-1 ${titleClasses}">
                        ${task.title}
                        <span class="badge ${priorityBadgeColors[task.priority]} ms-2 fs-6">${task.priority}</span>
                        ${isOverdue ? '<span class="badge bg-danger fs-6 ">OVERDUE</span>' : ''}
                    </h5>
                    <p class="card-text text-muted mb-0 small ${titleClasses}">
                        <i class="bi bi-calendar-event"></i> Deadline: ${task.deadline}
                    </p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm ${task.completed ? 'btn-warning' : 'btn-success'}" onclick="toggleComplete('${task.id}')">
                        ${task.completed ? 'Mark Pending' : 'Complete'}
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTask('${task.id}')">Delete</button>
                </div>
            </div>
        `;
        taskListContainer.appendChild(taskElement);
    });
}

const updateUI = debounce(renderTasks, 300);

addTaskBtn.addEventListener('click', addTask);

filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        currentFilter = e.target.textContent.trim();
        updateUI(); 
    });
});

sortTasksSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    updateUI();
});

renderTasks();  