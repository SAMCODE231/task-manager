// Select DOM elements for manipulating the task form and task display
const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

// Load task data from localStorage or initialize an empty array if none exists
const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {}; // Object to hold the task currently being edited

// Function to add a new task or update an existing one
const addOrUpdateTask = () => {
  // Find the index of the task to update, if it exists
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  
  // Create a new task object with the values from the input fields
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  };

  // Add new task or update existing task in the array
  if (dataArrIndex === -1) {
    taskData.unshift(taskObj); // Add new task to the beginning of the array
  } else {
    taskData[dataArrIndex] = taskObj; // Update existing task
  }

  // Save updated task data to localStorage
  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer(); // Refresh the displayed tasks
  reset(); // Clear the form inputs
};

// Function to update the task container display
const updateTaskContainer = () => {
  tasksContainer.innerHTML = ""; // Clear existing tasks

  // Loop through taskData and create HTML for each task
  taskData.forEach(
    ({ id, title, date, description }) => {
      tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button onclick="editTask(this)" type="button" class="btn">Edit</button>
          <button onclick="deleteTask(this)" type="button" class="btn">Delete</button> 
        </div>
      `;
    }
  );
};

// Function to delete a task
const deleteTask = (buttonEl) => {
  // Find index of the task to delete based on button's parent element ID
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  // Remove task element from the DOM and from taskData array
  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1);
  localStorage.setItem("data", JSON.stringify(taskData)); // Update localStorage
};

// Function to edit a task
const editTask = (buttonEl) => {
  // Find index of the task to edit
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  // Set currentTask to the task being edited
  currentTask = taskData[dataArrIndex];

  // Populate form inputs with the current task's details
  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  // Change button text to indicate update mode
  addOrUpdateTaskBtn.innerText = "Update Task";

  // Show the task form
  taskForm.classList.toggle("hidden");  
};

// Function to reset the form inputs and states
const reset = () => {
  addOrUpdateTaskBtn.innerText = "Add Task"; // Reset button text
  titleInput.value = ""; // Clear title input
  dateInput.value = ""; // Clear date input
  descriptionInput.value = ""; // Clear description input
  taskForm.classList.toggle("hidden"); // Hide the task form
  currentTask = {}; // Clear the currentTask object
};

// Update the task container if there are existing tasks
if (taskData.length) {
  updateTaskContainer();
}

// Event listener to open the task form
openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

// Event listener to close the task form
closeTaskFormBtn.addEventListener("click", () => {
  // Check if form inputs contain values and if they have changed
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

  // Show confirmation dialog if there are unsaved changes
  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset(); // Reset the form if no changes were made
  }
});

// Event listener for the cancel button on the confirmation dialog
cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

// Event listener for the discard button to close dialog and reset the form
discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});

// Event listener for the task form submission
taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  addOrUpdateTask(); // Call the function to add or update a task
});
