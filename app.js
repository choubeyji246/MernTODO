const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors');
const app = express();
const todoRouter = express.Router(); 
app.use(cors());
const Schema = mongoose.Schema;
todoRouter.use(bodyParser.json());
todoRouter.use(bodyParser.urlencoded({ extended: true }));
  
app.use('/api', todoRouter);  
  
app.use(express.json());
  
 
mongoose.connect('mongodb+srv://ankit:kRdvKJhWd2qsQ0GE@cluster0.3sackxo.mongodb.net/?retryWrites=true&w=majority',{dbName:"assigmentDb"}, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error(err);
  });
  const todoSchema = new Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
  });
  

  const Todo = mongoose.model('Todo', todoSchema);

  todoRouter.get('/todos', async (req, res) => {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  todoRouter.post('/todos', async (req, res) => {
    console.log(req.body);
    try {
      const { title } = req.body || {};
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }
      const todo = new Todo({ title });
      await todo.save();
      res.json(todo);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  todoRouter.put('/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { completed } = req.body;
      const todo = await Todo.findById(id);
      if (!todo) return res.status(404).json({ msg: 'Todo not found' });
      todo.completed = completed;
      await todo.save();
      res.json(todo);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  todoRouter.delete('/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const todo = await Todo.findByIdAndDelete(id);
      if (!todo) return res.status(404).json({ msg: 'Todo not found' });
      res.json({ msg: 'Todo deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
 




const port = 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
module.exports = Todo;