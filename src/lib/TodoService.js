class TodoService {
  // just simulating some storage here...
  // in reality you'd use the fetch api here...

  constructor() {
    this.todos = [
      {
        id: 1,
        text: "buy butter",
        done: true
      },
      {
        id: 2,
        text: "call tax attorney",
        done: false
      }
    ];
  }
 

  getTodos() {
    return this.todos;
  }

  updateTodoItem(todoItemToSave) {
    // just a "simulation"
    const todoItem = this.todos.find(todoItem => todoItem.id === todoItemToSave.id)
    todoItem.done = todoItemToSave.done;
    console.log("updated item status in 'database'");
    console.log(todoItem);
  }

  createNewTodo(todoItemText) {
    const newIndexOfTodoItem = this.todos.length + 1;
    const newTodoItem = {
      id: newIndexOfTodoItem,
      text: todoItemText,
      done: false
    }

    this.todos.push(newTodoItem);
  }

}

export const todoService = new TodoService();