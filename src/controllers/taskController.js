const taskService = require('../services/taskService');

async function create(req,res){
    try {
        const { title, description } = req.body;

        await taskService.createTask(title, description, req.user.id);

        res.json({ success: true, message: "Task created" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function remove(req,res){
    try {
        await taskService.deleteTask(req.params.id, req.user);

        res.json({ success: true, message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getAll(req,res){
    try {
        const tasks = await taskService.getAllTasks(req.user);

        res.json({ success: true, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getSpecific(req,res){
    try {
        const tasks = await taskService.getTasks(req.params.id,req.user);

        res.json({ success: true, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function update(req,res){
    try {
        const { title, description } = req.body;

        await taskService.updateTask(
        req.params.id,
        title,
        description,
          req.user
        );

        res.json({ success: true, message: "Task updated" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    create,
    remove,
    getAll,
    getSpecific,
    update,
}