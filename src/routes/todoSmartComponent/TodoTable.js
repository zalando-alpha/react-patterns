import style from './style';

const TodoTable = ({ todos, handleInputChange}) => {

  const allTodos = todos.map(todoItem =>

    (<tr>
      <td class={style.todoItem}>{todoItem.id}</td>
      <td class={style.todoItem}>{todoItem.text}</td>
      <td><input name="done" type="checkbox" checked={todoItem.done} onChange={handleInputChange(todoItem.id)} /></td>
    </tr>));

  return (<table>
    {allTodos}
  </table>)
};

export default TodoTable;