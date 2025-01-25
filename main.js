let tasksList = JSON.parse(localStorage.getItem("tasks_list")) || [];

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskBtn");
const inputError = document.querySelector("#inputErrors");

function displayTasks(tasks) {
  const tasksContainer = document.querySelector("#tasksList");
  tasksContainer.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskElement = `
      <div class="task-item ${task.isDone ? "completed" : "pending"}">
        <p class="task-text">${task.description}</p>
        <div class="task-actions">
          <input type="checkbox" ${task.isDone ? "checked" : ""} onchange="toggleTaskStatus(${index})">
          <i class="fa-solid fa-pencil edit" onclick="editTask(${index})"></i>
          <i class="fa-solid fa-trash remove" onclick="deleteTask(${index})"></i>
        </div>
      </div>
    `;
    tasksContainer.insertAdjacentHTML("beforeend", taskElement);
  });

  const bulkActions = document.querySelectorAll(".bulk-actions li");
  bulkActions.forEach((action) => {
    if (tasks.length > 0) {
      action.classList.remove("disabled");
    } else {
      action.classList.add("disabled");
    }
  });
}

function validateTask(task) {
  const startsWithNumber = /^[0-9]/.test(task);
  if (task === "") {
    return "Task cannot be empty!";
  } else if (startsWithNumber) {
    return "Task cannot start with a number.";
  } else if (task.length < 5) {
    return "Task description must be at least 5 characters.";
  }
  return null;
}

function toggleTaskStatus(index) {
  tasksList[index].isDone = !tasksList[index].isDone;
  displayTasks(tasksList);
  localStorage.setItem("tasks_list", JSON.stringify(tasksList));
}

addTaskButton.onclick = () => {
  const newTask = {
    description: taskInput.value.trim(),
    isDone: false,
  };

  const error = validateTask(newTask.description);
  if (!error) {
    tasksList.push(newTask);
    displayTasks(tasksList);
    taskInput.value = "";
    localStorage.setItem("tasks_list", JSON.stringify(tasksList));
  } else {
    inputError.textContent = error;
  }
};

const filterButtons = document.querySelectorAll(".filter-controls li");
filterButtons.forEach((button) => {
  button.onclick = () => {
    filterButtons.forEach((btn) => btn.classList.remove("active-filter"));
    button.classList.add("active-filter");

    const filterType = button.getAttribute("data-filter");
    switch (filterType) {
      case "all":
        displayTasks(tasksList);
        break;
      case "completed":
        displayTasks(tasksList.filter((task) => task.isDone));
        break;
      case "pending":
        displayTasks(tasksList.filter((task) => !task.isDone));
        break;
      default:
        alert("Filter not found!");
    }
  };
});

function editTask(index) {
  const editModal = document.querySelector(".edit-modal");
  const editInput = editModal.querySelector(".edit-input");
  const editError = editModal.querySelector("#editErrors");
  const saveButton = editModal.querySelector(".confirm-btn");
  const cancelButton = editModal.querySelector(".cancel-btn");

  editError.textContent = "";
  const selectedTask = tasksList[index];

  editInput.value = selectedTask.description;
  editModal.classList.add("active");

  cancelButton.onclick = () => {
    editModal.classList.remove("active");
  };

  saveButton.onclick = () => {
    const error = validateTask(editInput.value);
    if (error) {
      editError.textContent = error;
    } else {
      editError.textContent = "";
      selectedTask.description = editInput.value;
      tasksList[index] = selectedTask;
      displayTasks(tasksList);
      editModal.classList.remove("active");
      localStorage.setItem("tasks_list", JSON.stringify(tasksList));
    }
  };
}

const bulkActionButtons = document.querySelectorAll(".bulk-actions li");
const deleteModal = document.querySelector(".delete-modal");
const confirmButton = deleteModal.querySelector(".confirm-btn");
const cancelButton = deleteModal.querySelector(".cancel-btn");

function handleBulkAction(actionType) {
  switch (actionType) {
    case "clearCompleted":
      tasksList = tasksList.filter((task) => !task.isDone);
      break;
    case "clearAll":
      tasksList = [];
      break;
    default:
      console.error("Action does not exist!");
      return;
  }
  localStorage.setItem("tasks_list", JSON.stringify(tasksList));
  displayTasks(tasksList);
  deleteModal.classList.remove("active");
}

bulkActionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const actionType = button.getAttribute("data-action");
    deleteModal.classList.add("active");
    confirmButton.onclick = () => handleBulkAction(actionType);
    cancelButton.onclick = () => deleteModal.classList.remove("active");
  });
});

function deleteTask(index) {
  deleteModal.classList.add("active");

  confirmButton.onclick = () => {
    tasksList = tasksList.filter((task, i) => i !== index);
    displayTasks(tasksList);
    localStorage.setItem("tasks_list", JSON.stringify(tasksList));
    deleteModal.classList.remove("active");
  };

  cancelButton.onclick = () => {
    deleteModal.classList.remove("active");
  };
}

displayTasks(tasksList);