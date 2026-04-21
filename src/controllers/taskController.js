const taskService = require('../services/taskService');

async function create(req,res){
    try {
        const { title, description } = req.body;
        
        if (!title || title.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Title is required"
        });
        }

        await taskService.createTask(title, description, req.user.id);

        res.json({ success: true, message: "Task created" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function remove(req,res){
    try { 
        if (isNaN(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID"
            });
        }
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

        if (isNaN(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID"
            });
        }
        
        const tasks = await taskService.getTasks(req.params.id,req.user);

        if (!tasks) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
        }

        res.json({ success: true, data: tasks });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function update(req,res){
    try {
        const { title, description } = req.body;


        if (!title || title.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Title is required"
        });
        }

        if (isNaN(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid task ID"
        });
        }

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