import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Navbar from "./components/Navbar";

function App() {
  const [newTodo, setNewTodo] = useState("");

  const [todoList, setTodoList] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [editingID, setEditingID] = useState(null);
  const [editText, setEditText] = useState("");

  // This handles ALL saving automatically
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todoList));
  }, [todoList]);

  const addTodo = () => {
    if (newTodo.length !== 0) {
      setTodoList([
        ...todoList,
        { todoId: uuidv4(), todoDesc: newTodo, isCompleted: false },
      ]);
      setNewTodo("");
    }
  };

  const startEditing = (id, currentText) => {
    setEditingID(id);
    setEditText(currentText);
  };

  const save = () => {
    let newTodoList = todoList.map((item) => {
      if (item.todoId === editingID) {
        return { ...item, todoDesc: editText };
      }
      return item;
    });

    setTodoList(newTodoList);
    setEditingID(null);
  };

  const deleteTodo = (e) => {
    let id = e.target.name;
    setTodoList(
      todoList.filter((item) => {
        return item.todoId !== id;
      }),
    );
  };

  const handleChange = (e) => {
    setNewTodo(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
    if (e.key === "Escape") {
      setNewTodo("");
      e.currentTarget.blur();
    }
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todoList.findIndex((item) => {
      return item.todoId === id;
    });
    let newArr = [...todoList];
    newArr[index].isCompleted = !newArr[index].isCompleted;
    setTodoList(newArr);
  };

  const handleList = () => {
    return todoList.length === 0;
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto ">
        <div className="bg-violet-200 rounded-xl p-4 mx-auto">
          <div className="addTodo">
            <h2 className="text-s font-semibold">Add a Todo</h2>
            <div className="flex justify-around">
              <input
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                value={newTodo}
                placeholder="Add a Todo Item"
                className="border border-black border-solid rounded-lg p-2 w-4/5 "
                type="text"
              />
              <button
                onClick={addTodo}
                className="bg-green-300 rounded-lg p-2 border-black border border-solid hover:bg-green-400 cursor-pointer min-w-1/10"
              >
                Add Item
              </button>
            </div>
          </div>
          <h1 className="font-bold my-2.5 text-center text-2xl">Todo List</h1>
          <div className="todos p-2 bg-violet-100 rounded-lg flex flex-col gap-4">
            {handleList() && (
              <div className="todo flex items-center">No Todos to display </div>
            )}
            {todoList.map((item) => {
              // --- EDIT MODE ---
              if (item.todoId === editingID) {
                return (
                  <div
                    key={item.todoId}
                    className="todo flex justify-between items-center"
                  >
                    <div className="font-semibold pl-3.5 text-lg flex flex-row gap-5 items-center justify-center">
                      <input
                        type="checkbox"
                        name={item.todoId}
                        onChange={handleCheckbox}
                        checked={item.isCompleted}
                        className="w-4 h-4"
                      />
                      <input
                        className={
                          item.isCompleted
                            ? "line-through todo-desc"
                            : "todo-desc"
                        }
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            save();
                          } else if (e.key === "Escape") {
                            setEditingID(null);
                          }
                        }}
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        className={`py-1 px-2 font-semibold rounded-md ${
                          item.isCompleted
                            ? "bg-gray-300 cursor-not-allowed" // Styles when completed (No hover, Gray)
                            : "bg-blue-300 hover:bg-blue-400 cursor-pointer" // Styles when active
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        name={item.todoId}
                        onClick={deleteTodo}
                        className="bg-red-300 hover:bg-red-400 py-1 px-2 font-semibold rounded-md cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              }
              // --- VIEW MODE ---
              else {
                return (
                  <div
                    key={item.todoId}
                    className="todo flex justify-between items-center"
                  >
                    <div className="font-semibold pl-3.5 text-lg flex flex-row gap-5 items-center justify-center">
                      <input
                        type="checkbox"
                        name={item.todoId}
                        onChange={handleCheckbox}
                        checked={item.isCompleted}
                        className="w-4 h-4"
                      />
                      <div className={item.isCompleted ? "line-through" : ""}>
                        {item.todoDesc}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => startEditing(item.todoId, item.todoDesc)}
                        className={`py-1 px-2 font-semibold rounded-md ${
                          item.isCompleted
                            ? "bg-gray-300 cursor-not-allowed" // Styles when completed (No hover, Gray)
                            : "bg-blue-300 hover:bg-blue-400 cursor-pointer" // Styles when active
                        }`}
                        disabled={item.isCompleted}
                      >
                        Edit
                      </button>
                      <button
                        name={item.todoId}
                        onClick={deleteTodo}
                        className="bg-red-300 hover:bg-red-400 py-1 px-2 font-semibold rounded-md cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
