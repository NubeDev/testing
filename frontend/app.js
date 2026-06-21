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

function renderTodo(id, title) {
  const li = document.createElement('li');
  li.dataset.id = id;

  const span = document.createElement('span');
  span.className = 'todo-title';
  span.textContent = `#${id} — ${title}`;

  const btnGroup = document.createElement('div');
  btnGroup.className = 'btn-group';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'edit-btn';
  editBtn.addEventListener('click', () => enterEditMode(li, id, title));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', () => deleteTodo(id));

  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(deleteBtn);
  li.appendChild(span);
  li.appendChild(btnGroup);
  return li;
}

function enterEditMode(li, id, currentTitle) {
  li.innerHTML = '';

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'edit-input';
  editInput.value = currentTitle;

  const btnGroup = document.createElement('div');
  btnGroup.className = 'btn-group';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'save-btn';
  saveBtn.addEventListener('click', () => {
    const newTitle = editInput.value.trim();
    if (newTitle) editTodo(id, newTitle);
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'cancel-btn';
  cancelBtn.addEventListener('click', () => loadTodos());

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { const t = editInput.value.trim(); if (t) editTodo(id, t); }
    if (e.key === 'Escape') loadTodos();
  });

  btnGroup.appendChild(saveBtn);
  btnGroup.appendChild(cancelBtn);
  li.appendChild(editInput);
  li.appendChild(btnGroup);
  editInput.focus();
  editInput.select();
}

async function loadTodos() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const todos = await res.json();
    list.innerHTML = '';
    todos.forEach(({ id, title }) => list.appendChild(renderTodo(id, title)));
    clearError();
  } catch (err) {
    showError(`Failed to load todos: ${err.message}`);
  }
}

async function editTodo(id, title) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Server error: ${res.status}`);
    }
    await loadTodos();
    clearError();
  } catch (err) {
    showError(`Failed to edit todo: ${err.message}`);
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
