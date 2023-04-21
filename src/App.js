import "./App.css";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newTodo);
    axios
      .post("http://localhost:5000/api/todos", { title: newTodo })
      .then((res) =>
       setTodos([...todos, res.data]))
      .catch((err) => {
        console.error(err);
        alert("An error occurred while creating the todo.");
      });
    setNewTodo("");
  };
  const handleDragEnd = async result => {
    if (!result.destination) return;
    const { source, destination } = result;
    const newTodos = Array.from(todos);
    const [removed] = newTodos.splice(source.index, 1);
    newTodos.splice(destination.index, 0, removed);
    setTodos(newTodos);
    
    try {
      await axios.patch(`http://localhost:5000/api/todos/${removed._id}`, { order: destination.index });
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    <div className="App">
      <h1>Todo List</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {todos.map((todo, index) => (
                <Draggable key={todo._id} draggableId={todo._id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={(e) => {
                          axios
                            .put(`http://localhost:5000/api/todos/${todo._id}`, {
                              completed: e.target.checked,
                            })
                            .then((res) =>
                              setTodos(
                                todos.map((t) =>
                                  t._id === todo._id ? res.data : t
                                )
                              )
                            )
                            .catch((err) => console.error(err));
                        }}
                      />
                      <span
                        style={{
                          textDecoration: todo.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {todo.title}
                      </span>
                      <button
                        onClick={() => {
                          axios
                            .delete(`http://localhost:5000/api/todos/${todo._id}`)
                            .then((res) =>
                              setTodos(todos.filter((t) => t._id !== todo._id))
                            )
                            .catch((err) => console.error(err));
                        }}
                      >
                        Delete
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setNewTodo(e.target.value)}
          value={newTodo}
          placeholder="Add new Todo..."
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
export default App;
