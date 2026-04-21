const db = require('../config/db.js');

async function createTask(title, description, userId) {
    const task = await db.query(
        "INSERT INTO tasks (title, description, userId) VALUES(?,?,?)",
        [title,description,userId]
    );
    return task;
}

async function getAllTasks(user) {
    if (user.role === "ADMIN") {
        const [rows] = await db.query("SELECT * FROM tasks");
        return rows;
    } else {
        const [rows] = await db.query(
        "SELECT * FROM tasks WHERE userId = ?",
        [user.id]
        );
        return rows;
    }
}

async function getTasks(id,user) {
    if (user.role === "ADMIN") {
        const [rows] = await db.query("SELECT * FROM tasks WHERE id=?",[id]);
        if (!rows[0]) {
            throw new Error("Task not found");
        }
        return rows;
    } else {
        const [rows] = await db.query(
        "SELECT * FROM tasks WHERE userId = ? AND id=?",
        [user.id,id]
        );
        if (!rows[0]) {
            throw new Error("Task not found");
        }
        return rows;
    }
}

async function updateTask(id, title, description, user){
    if (user.role === "ADMIN") {
        await db.query(
        "UPDATE tasks SET title=?, description=? WHERE id=?",
        [title, description, id]
        );
    } 
    else {
        await db.query(
        "UPDATE tasks SET title=?, description=? WHERE id=? AND userId=?",
        [title, description, id, user.id]
        );
    }
}

async function deleteTask(id,user) {
    if (user.role === "ADMIN") {
        await db.query("DELETE FROM tasks WHERE id=?", [id]);
    } 
    else {
        await db.query(
        "DELETE FROM tasks WHERE id=? AND userId=?",
        [id, user.id]
        );
    }
}

module.exports = {
    createTask,
    getTasks,
    getAllTasks,
    deleteTask,
    updateTask,
    
}