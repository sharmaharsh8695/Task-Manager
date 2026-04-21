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
        return rows[0];
    } else {
        const [rows] = await db.query(
        "SELECT * FROM tasks WHERE userId = ? AND id=?",
        [user.id,id]
        );
        if (!rows[0]) {
            throw new Error("Task not found");
        }
        return rows[0];
    }
}

async function updateTask(id, title, description, user){

    let result;
    if (user.role === "ADMIN") {
        [result] = await db.query(
        "UPDATE tasks SET title=?, description=? WHERE id=?",
        [title, description, id]
        );
    } 
    else {
        [result] = await db.query(
        "UPDATE tasks SET title=?, description=? WHERE id=? AND userId=?",
        [title, description, id, user.id]
        );
    }
    if(result.affectedRows==0){
        throw new Error("No record found");
    }

}

async function deleteTask(id,user) {
    let result
    if (user.role === "ADMIN") {
        [result] = await db.query("DELETE FROM tasks WHERE id=?", [id]);
    } 
    else {
        [result] = await db.query(
        "DELETE FROM tasks WHERE id=? AND userId=?",
        [id, user.id]
        );
    }
    if(result.affectedRows==0){
        throw new Error("No record found");
    }
}

module.exports = {
    createTask,
    getTasks,
    getAllTasks,
    deleteTask,
    updateTask,
    
}