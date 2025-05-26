const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app =express();
app.use(cors());
app.use(express.json())

mongoose.connect(process.env.MONGO_URI).then(()=> console.log('MONGO DB connected')).catch((err)=> console.error(err));

const Todo = mongoose.model('Todo',new mongoose.Schema({
    text: String,
    completed: { type: Boolean, default:false}
}));

//Routes

app.get('/', (req, res) => {
    res.send('Server is alive');
});

app.get('/api/todos', async (req, res) => {
    const todos = await Todo.find();
    const formattedTodos = todos.map(todo => ({
      id: todo._id,
      text: todo.text,
      isCompleted: todo.completed
    }));
    res.json(formattedTodos);
});

app.post('/api/todos', async(req,res)=>{
    const todo = new Todo({ text: req.body.text});
    await todo.save();
    res.json(todo);
})

app.put('/api/todos', async(req,res)=>{
    const todo = await Todo.findByIdAndUpdate(req.params.id, {
        completed:true
    });
    res.json(todo);
});

app.delete('/api/todos/:id', async(req,res)=>{
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
