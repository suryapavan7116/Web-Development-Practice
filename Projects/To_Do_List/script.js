let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editId = null;
let draggedTask = null;

const modal = document.getElementById("modal");
const saveBtn = document.getElementById("saveTask");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("desc");
const dateInput = document.getElementById("date");
const prioritySelect = document.getElementById("priority");
const completedEl = document.getElementById("completed");

// Open modal
document.getElementById("addTaskBtn").onclick = () => {
  editId = null;
  titleInput.value = "";
  descInput.value = "";
  dateInput.value = "";
  prioritySelect.value = "low";
  document.getElementById("modalTitle").innerText = "Add Task";
  modal.style.display = "block";
};

// Close modal on outside click
modal.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

// Save / Edit
saveBtn.onclick = () => {
  if (!titleInput.value.trim()) {
    alert("Please enter a task title");
    return;
  }

  const taskData = {
    id: editId || Date.now(),
    title: titleInput.value,
    desc: descInput.value,
    date: dateInput.value,
    priority: prioritySelect.value,
    status: editId ? tasks.find(t => t.id === editId)?.status : "todo"
  };
  
  if (editId) {
    tasks = tasks.map(t => t.id === editId ? taskData : t);
  } else {
    tasks.push(taskData);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  modal.style.display = "none";
  render();
};
// Render
function render() {
  document.querySelectorAll(".task-list").forEach(c => c.innerHTML = "");

  let completed = 0;
  const search = document.getElementById("search").value.toLowerCase();
  const filter = document.getElementById("filter").value;

  // Reverse mapping for getting the correct element ID from status
  const taskListIdMap = {
    "todo": "todo",
    "progress": "inProgress",
    "done": "done"
  };

  tasks.forEach(task => {
    if (!task.title.toLowerCase().includes(search)) return;
    if (filter !== "all" && task.priority !== filter) return;

    const div = document.createElement("div");
    div.className = `task ${task.priority}`;
    div.draggable = true;
    div.dataset.id = task.id;

    div.innerHTML = `
      <strong>${task.title}</strong>
      <p>${task.desc || "No description"}</p>
      <small>📅 ${task.date || "No date"}</small>
      <div style="margin-top: 10px; display: flex; gap: 8px;">
        <button class="task-btn edit-btn" onclick="editTask(${task.id})" title="Edit">✏️ Edit</button>
        <button class="task-btn delete-btn" onclick="deleteTask(${task.id})" title="Delete">🗑️ Delete</button>
      </div>
    `;

    // Drag start
    div.addEventListener("dragstart", (e) => {
      draggedTask = task;
      div.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
    });

    // Drag end
    div.addEventListener("dragend", () => {
      div.classList.remove("dragging");
    });

    // Get the correct task list element ID from the status
    const taskListElementId = taskListIdMap[task.status] || task.status;
    const taskListElement = document.getElementById(taskListElementId);
    
    if (taskListElement) {
      taskListElement.appendChild(div);
    }
    
    if (task.status === "done") completed++;
  });

  updateStats(completed);
  setupDragOverListeners();
}

function editTask(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  
  titleInput.value = t.title;
  descInput.value = t.desc;
  dateInput.value = t.date;
  prioritySelect.value = t.priority;
  editId = id;
  document.getElementById("modalTitle").innerText = "Edit Task";
  modal.style.display = "block";
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    render();
  }
}

function updateStats(completed) {
  const totalEl = document.getElementById("total");
  const pendingEl = document.getElementById("pending");
  const progressFill = document.getElementById("progressFill");
  const progressPercent = document.getElementById("progressPercent");
  
  totalEl.innerText = tasks.length;
  completedEl.innerText = completed;
  pendingEl.innerText = tasks.length - completed;
  
  const progressValue = tasks.length ? (completed / tasks.length) * 100 : 0;
  progressFill.style.width = progressValue + "%";
  progressPercent.innerText = Math.round(progressValue) + "%";
}

// ID mapping for columns
const statusMap = {
  "todo": "todo",
  "inProgress": "progress",
  "done": "done"
};

// Setup drag over listeners for each task list
function setupDragOverListeners() {
  document.querySelectorAll(".task-list").forEach(col => {
    col.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      col.classList.add("drag-over");
    });

    col.addEventListener("dragleave", () => {
      col.classList.remove("drag-over");
    });

    col.addEventListener("drop", (e) => {
      e.preventDefault();
      col.classList.remove("drag-over");
      
      if (draggedTask) {
        const task = tasks.find(t => t.id === draggedTask.id);
        if (task) {
          // Map the column ID to the correct status
          task.status = statusMap[col.id] || col.id;
          localStorage.setItem("tasks", JSON.stringify(tasks));
          render();
        }
      }
      draggedTask = null;
    });
  });
}
// Search & Filter
document.getElementById("search").addEventListener("input", render);
document.getElementById("filter").addEventListener("change", render);

// Dark Mode
document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
};

// Restore theme on page load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// Initialize
render();