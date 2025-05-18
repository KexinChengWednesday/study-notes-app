const form = document.getElementById("note-form");
const notesList = document.getElementById("notes-list");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const tagInput = document.getElementById("tag");
const priorityInput = document.getElementById("priority");
const searchInput = document.getElementById("search");
const userEmailEl = document.getElementById("userEmail");
const settingsPanel = document.getElementById("settings-panel");

const db = window.db;
const auth = window.auth;
let currentUser = null;
let viewHistory = [];

function highlight(text, keyword) {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    userEmailEl.textContent = user.email;
    showAllNotes();
  } else {
    window.location.href = "index.html";
  }
});

form.onsubmit = async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const tag = tagInput.value.trim();
  const priority = priorityInput.value;

  if (!title || !content || !currentUser) return;

  await db.collection("notes").add({
    title,
    content,
    tag,
    priority,
    star: false,
    createdAt: new Date(),
    uid: currentUser.uid
  });

  form.reset();
  showAllNotes();
};

function renderNotes(docs, filter = {}) {
  const keyword = searchInput.value.trim().toLowerCase();
  notesList.innerHTML = "";
  const grouped = {};

  docs.forEach((docSnap) => {
    const note = docSnap.data();
    if (filter.priority && note.priority !== filter.priority) return;
    if (keyword && !(
      note.title?.toLowerCase().includes(keyword) ||
      note.content?.toLowerCase().includes(keyword) ||
      note.tag?.toLowerCase().includes(keyword)
    )) return;

    const tag = note.tag || "Uncategorized";
    if (!grouped[tag]) grouped[tag] = [];
    grouped[tag].push({ docSnap, note });
  });

  for (const tag in grouped) {
    const groupDiv = document.createElement("div");
    groupDiv.innerHTML = `<h4>📂 ${tag}</h4>`;
    grouped[tag].forEach(({ docSnap, note }) => {
      const div = document.createElement("div");
      div.className = "note-card";
      div.innerHTML = `
        <h3 contenteditable="true" data-id="${docSnap.id}" data-field="title">${highlight(note.title, keyword)}</h3>
        <p contenteditable="true" data-id="${docSnap.id}" data-field="content">${highlight(note.content, keyword)}</p>
        <small><strong>Tag:</strong> ${highlight(note.tag || "None", keyword)} | <strong>Priority:</strong> ${note.priority || "-"}</small>
        <div style="text-align:right; margin-top:10px;">
          <button class="delete-btn" data-id="${docSnap.id}">Delete</button>
          <button class="star-btn" data-id="${docSnap.id}">${note.star ? "⭐" : "☆"}</button>
        </div>
      `;
      div.onclick = () => recordView(note);
      groupDiv.appendChild(div);
    });
    notesList.appendChild(groupDiv);
  }

  if (docs.length === 0 || notesList.innerHTML === "") {
    notesList.innerHTML = "<p>No matching notes found.</p>";
  }
}

function recordView(note) {
  const entry = { title: note.title, time: new Date().toLocaleString() };
  viewHistory.unshift(entry);
  if (viewHistory.length > 20) viewHistory.pop();
}

notesList.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains("delete-btn")) {
    await db.collection("notes").doc(id).delete();
    showAllNotes();
  } else if (e.target.classList.contains("star-btn")) {
    const ref = db.collection("notes").doc(id);
    const doc = await ref.get();
    const current = doc.data().star || false;
    await ref.update({ star: !current });
    showAllNotes();
  }
});

notesList.addEventListener("blur", async (e) => {
  if (e.target.hasAttribute("contenteditable")) {
    const id = e.target.dataset.id;
    const field = e.target.dataset.field;
    const value = e.target.textContent.trim();
    await db.collection("notes").doc(id).update({ [field]: value });
  }
}, true);

searchInput.oninput = () => {
  showAllNotes();
};

function showAllNotes() {
  db.collection("notes")
    .where("uid", "==", currentUser.uid)
    .orderBy("star", "desc")
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => renderNotes(snapshot.docs));
}

function showPriority() {
  db.collection("notes")
    .where("uid", "==", currentUser.uid)
    .get()
    .then(snapshot => renderNotes(snapshot.docs, { priority: "high" }));
}

function showHistory() {
  notesList.innerHTML = "<h3>📜 Recently Viewed Notes</h3>";
  viewHistory.forEach(entry => {
    const div = document.createElement("div");
    div.className = "note-card";
    div.innerHTML = `<h4>${entry.title}</h4><p><small>${entry.time}</small></p>`;
    notesList.appendChild(div);
  });
}

function openSettings() {
  settingsPanel.classList.toggle("hidden");
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function toggleLayout() {
  document.body.classList.toggle("compact");
}

window.logout = async () => {
  await auth.signOut();
  localStorage.removeItem("userEmail");
  window.location.href = "index.html";
};

// Register functions globally
window.showAllNotes = showAllNotes;
window.showPriority = showPriority;
window.showHistory = showHistory;
window.openSettings = openSettings;
window.toggleTheme = toggleTheme;
window.toggleLayout = toggleLayout;
