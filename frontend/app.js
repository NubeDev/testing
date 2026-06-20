const API = 'http://localhost:3000/api/todos';

const list = document.getElementById('todo-list');
const form = document.getElementById('add-form');
const input = document.getElementById('todo-input');
const error = document.getElementById('error');

function showError(msg) {
  error.textContent = msg;
  error.hidden = false;
}

function clearError() {
  error.hidden = true;
}

async function loadTodos() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const todos = await res.json();
    list.innerHTML = '';
    todos.forEach(({ id, title }) => {
      const li = document.createElement('li');
      li.textContent = `#${id} — ${title}`;
      list.appendChild(li);
    });
    clearError();
  } catch (err) {
    showError(`Failed to load todos: ${err.message}`);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Server error: ${res.status}`);
    }
    input.value = '';
    await loadTodos();
    clearError();
  } catch (err) {
    showError(`Failed to add todo: ${err.message}`);
  }
});

loadTodos();
