// ===== State =====
let activities = JSON.parse(localStorage.getItem("activities")) || [];
let filter = "all";

// ===== DOM =====
const list = document.getElementById("activityList");
const input = document.getElementById("activityInput");
const addBtn = document.getElementById("addBtn");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const filterBtns = document.querySelectorAll(".filters button");

// ===== Add Activity =====
addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  activities.push({
    id: Date.now(),
    name: text,
    completed: false
  });

  input.value = "";
  saveAndRender();
});

// ===== Toggle Complete =====
function toggleComplete(id) {
  activities = activities.map(a =>
    a.id === id ? { ...a, completed: !a.completed } : a
  );
  saveAndRender();
}

// ===== Delete Activity =====
function deleteActivity(id) {
  activities = activities.filter(a => a.id !== id);
  saveAndRender();
}

// ===== Filter =====
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    btn.classList.add("active");
    filter = btn.dataset.filter;
    render();
  });
});

// ===== Render =====
function render() {
  list.innerHTML = "";

  let filtered = activities.filter(a => {
    if (filter === "completed") return a.completed;
    if (filter === "pending") return !a.completed;
    return true;
  });

  filtered.forEach(a => {
    const li = document.createElement("li");
    if (a.completed) li.classList.add("completed");

    li.innerHTML = `
      <span>${a.name}</span>
      <div class="actions">
        <button class="complete-btn" onclick="toggleComplete(${a.id})">
          ${a.completed ? "Undo" : "Done"}
        </button>
        <button class="delete-btn" onclick="deleteActivity(${a.id})">
          Delete
        </button>
      </div>
    `;

    list.appendChild(li);
  });

  updateProgress();
}

// ===== Progress =====
function updateProgress() {
  const completed = activities.filter(a => a.completed).length;
  const total = activities.length;

  progressText.textContent = `${completed} / ${total} Completed`;

  const percent = total === 0 ? 0 : (completed / total) * 100;
  progressBar.value = percent;

  if (completed === total && total > 0) {
    progressText.textContent += " 🎉";
  }
}

// ===== Save =====
function saveAndRender() {
  localStorage.setItem("activities", JSON.stringify(activities));
  render();
}

// ===== Init =====
render();