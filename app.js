const form = document.getElementById("note-form");
const notesList = document.getElementById("notes-list");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const tagInput = document.getElementById("tag");
const searchInput = document.getElementById("search");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");
const container = document.querySelector(".container");

const db = window.db;
const auth = window.auth;
let currentUser = null;

signupBtn.onclick = async () => {
  try {
    await auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value);
    alert("Account created!");
  } catch (e) {
    alert(e.message);
  }
};

loginBtn.onclick = async () => {
  try {
    await auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value);
  } catch (e) {
    alert(e.message);
  }
};

logoutBtn.onclick = async () => {
  await auth.signOut();
};

auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    document.querySelector(".auth").style.display = "none";
    container.style.display = "block";
    listenToUserNotes();
    logoutBtn.style.display = "inline-block";
  } else {
    container.style.display = "none";
    document.querySelector(".auth").style.display = "flex";
    logoutBtn.style.display = "none";
    currentUser = null;
  }
});

form.onsubmit = async (e) => {
  e.preventDefault();
  await db.collection("notes").add({
    title: titleInput.value,
    content: contentInput.value,
    tag: tagInput.value,
    createdAt: new Date(),
    uid: currentUser.uid
  });
  form.reset();
};

function listenToUserNotes() {
  db.collection("notes")
    .where("uid", "==", currentUser.uid)
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      renderNotes(snapshot.docs);
    });
}

function renderNotes(docs) {
  notesList.innerHTML = "";
  docs.forEach((docSnap) => {
    const note = docSnap.data();
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";
    noteDiv.innerHTML = `
      <h3 contenteditable="true" data-id="${docSnap.id}" data-field="title">${note.title}</h3>
      <p contenteditable="true" data-id="${docSnap.id}" data-field="content">${note.content}</p>
      <small><strong>Tag:</strong> ${note.tag || "None"}</small>
      <button data-id="${docSnap.id}">Delete</button>
    `;
    notesList.appendChild(noteDiv);
  });
}

notesList.addEventListener("blur", async (e) => {
  if (e.target.hasAttribute("contenteditable")) {
    const id = e.target.dataset.id;
    const field = e.target.dataset.field;
    const value = e.target.textContent;
    const ref = db.collection("notes").doc(id);
    await ref.update({ [field]: value });
  }
}, true);

notesList.addEventListener("click", async (e) => {
  if (e.target.tagName === "BUTTON") {
    const id = e.target.dataset.id;
    await db.collection("notes").doc(id).delete();
  }
});

searchInput.oninput = async () => {
  const keyword = searchInput.value.toLowerCase();
  const snapshot = await db.collection("notes").where("uid", "==", currentUser.uid).get();
  const filtered = snapshot.docs.filter(docSnap => {
    const data = docSnap.data();
    return (
      data.title.toLowerCase().includes(keyword) ||
      data.content.toLowerCase().includes(keyword)
    );
  });
  renderNotes(filtered);
};
