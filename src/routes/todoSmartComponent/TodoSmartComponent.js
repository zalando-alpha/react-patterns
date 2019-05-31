import { h, Component } from 'preact';
import TodoTable from './TodoTable';
import style from './style';


import { todoService } from "../../lib/TodoService";

export default class TodoSmartComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: []
    };
    this.notificationMoleConnectorService = props.notificationMoleConnectorService;
  }

  componentDidMount() {
    this._loadData();
  }

  handleInputChange = (id) => (event) => {
    event.preventDefault();

    const selectedTodoItem = this.state.todos.find(todoItem => todoItem.id === id);
    const copiedSelectedTodoItem = Object.assign({}, selectedTodoItem);
    copiedSelectedTodoItem.done = !selectedTodoItem.done;

    todoService.updateTodoItem(copiedSelectedTodoItem);
    this._loadData();

    this.notificationMoleConnectorService.showNotification("Changed checkbox value.");
  }

  showInputField = () => {
    const newTodoText = window.prompt("New Todo:", "");
    if (newTodoText !== null && newTodoText !== "") {
      todoService.createNewTodo(newTodoText);
      // simply reload everything...
      this._loadData();
      this.notificationMoleConnectorService.showNotification("Item created!");
    }
  }

  _loadData() {
    this.todos = todoService.getTodos();
    this.setState({ todos: this.todos });
  }

  render() {
    return (
      <div class={style.content}>
        <h1>My TODO items</h1>
        <TodoTable todos={this.state.todos} handleInputChange={this.handleInputChange} />
        <input value="Create new item" type="button" onClick={this.showInputField} />
      </div>
    );
  }
}