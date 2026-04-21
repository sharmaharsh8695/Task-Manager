class TaskManagerApp {
    constructor() {
        this.token = localStorage.getItem('token');
        this.currentUser = localStorage.getItem('user');
        this.apiUrl = 'http://localhost:3000/api/v1'; // Change to your backend URL
        
        this.init();
    }

    init() {
        this.bindEvents();
        if (this.token) {
            this.showDashboard();
            this.loadTasks();
        } else {
            this.showAuth();
        }
    }

    bindEvents() {
        // Auth events
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('show-register').addEventListener('click', () => this.showRegister());
        document.getElementById('show-login').addEventListener('click', () => this.showLogin());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());

        // Task events
        document.getElementById('add-task-form').addEventListener('submit', (e) => this.handleAddTask(e));
    }

    async apiRequest(endpoint, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { Authorization: `Bearer ${this.token}` })
            },
            ...options
        };

        try {
            const response = await fetch(`${this.apiUrl}${endpoint}`, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            return data;
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const { token, user } = await this.apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            this.token = token;
            this.currentUser = user;
            this.showDashboard();
            this.loadTasks();
            this.showMessage('Login successful!', 'success');
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const { token, user } = await this.apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            this.token = token;
            this.currentUser = user;
            this.showDashboard();
            this.loadTasks();
            this.showMessage('Registration successful!', 'success');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    }

    async loadTasks() {
        try {
            const tasks = await this.apiRequest('/tasks');
            this.renderTasks(tasks);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    }

    async handleAddTask(e) {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;

        try {
            const newTask = await this.apiRequest('/tasks', {
                method: 'POST',
                body: JSON.stringify({ title, description })
            });
            
            document.getElementById('add-task-form').reset();
            this.loadTasks();
            this.showMessage('Task added successfully!', 'success');
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    }

    async deleteTask(id) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        try {
            await this.apiRequest(`/tasks/${id}`, { method: 'DELETE' });
            this.loadTasks();
            this.showMessage('Task deleted successfully!', 'success');
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    }

    async updateTask(id, updates) {
        try {
            await this.apiRequest(`/tasks/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates)
            });
            this.loadTasks();
            this.showMessage('Task updated successfully!', 'success');
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }

    renderTasks(tasks) {
        const container = document.getElementById('tasks-list');
        if (!tasks || tasks.length === 0) {
            container.innerHTML = '<div class="loading">No tasks yet. Add one above!</div>';
            return;
        }

        container.innerHTML = tasks.map(task => `
            <div class="task-card">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <div class="task-actions">
                    <button class="btn btn-edit" onclick="app.editTask(${task.id}, '${task.title}', '${task.description}')">
                        Edit
                    </button>
                    <button class="btn btn-delete" onclick="app.deleteTask(${task.id})">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    editTask(id, title, description) {
        const newTitle = prompt('Edit title:', title);
        const newDescription = prompt('Edit description:', description);
        
        if (newTitle && newDescription) {
            this.updateTask(id, { title: newTitle, description: newDescription });
        }
    }

    showMessage(message, type) {
        const existing = document.querySelector('.error, .success');
        if (existing) existing.remove();

        const msg = document.createElement('div');
        msg.className = type;
        msg.textContent = message;
        document.querySelector('.container').insertBefore(msg, document.querySelector('.container').firstChild);
        
        setTimeout(() => msg.remove(), 3000);
    }

    showAuth() {
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('dashboard-container').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('hidden');
    }

    showRegister() {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
    }

    showLogin() {
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    }

    showDashboard() {
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('dashboard-container').classList.remove('hidden');
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.token = null;
        this.currentUser = null;
        this.showAuth();
    }
}

// Global app instance
const app = new TaskManagerApp();