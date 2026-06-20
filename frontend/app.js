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
      const span = document.createElement('span');
      span.textContent = `#${id} — ${title}`;
      const btn = document.createElement('button');
      btn.textContent = 'Delete';
      btn.className = 'delete-btn';
      btn.dataset.id = id;
      btn.addEventListener('click', () => deleteTodo(id));
      li.appendChild(span);
      li.appendChild(btn);
      list.appendChild(li);
    });
    clearError();
  } catch (err) {
    showError(`Failed to load todos: ${err.message}`);
  }
}

async function deleteTodo(id) {
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Server error: ${res.status}`);
    }
    await loadTodos();
    clearError();
  } catch (err) {
    showError(`Failed to delete todo: ${err.message}`);
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
