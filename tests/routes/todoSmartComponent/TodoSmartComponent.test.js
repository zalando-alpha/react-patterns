import { shallow } from 'preact-render-spy';
import TodoSmartComponent from '../../../src/routes/todoSmartComponent/TodoSmartComponent';
jest.mock('../../../src/lib/TodoService');
import { todoService } from '../../../src/lib/TodoService';


describe('TodoSmartComponent', () => {

  test('should load data on mount...', async () => {
    // GIVEN
    const dummyData = [{
      "done": true,
      "id": 1,
      "text": "buy butter",
    }, {
      "done": false,
      "id": 42,
      "text": "call tax attorney",
    }];

    todoService.getTodos = jest.fn(() => dummyData);

    console.log(todoService);

    // WHEN
    const todoSmartComponent = shallow(<TodoSmartComponent />)
    await Promise.resolve(); // TODO: for a more nice version...

    // THEN
    expect(todoService.getTodos).toBeCalled();
    expect(todoSmartComponent.find("TodoTable").length).toBe(1);
    expect(todoSmartComponent.find("TodoTable").attr("todos")).toBe(dummyData);
  });

  test('should forward handleInputChange', async () => {
    // GIVEN
    const dummyEvent = {
      preventDefault: jest.fn()
    }
    const dummyData = [{
      "done": true,
      "id": 1,
      "text": "buy butter",
    }, {
      "done": false,
      "id": 42,
      "text": "call tax attorney",
    }];

    todoService.getTodos = jest.fn(() => dummyData);
    todoService.updateTodoItem = jest.fn(() => []);

    const notificationMoleConnectorServiceMock = {
      showNotification: jest.fn()
    };

    // WHEN
    const todoSmartComponent = shallow(<TodoSmartComponent notificationMoleConnectorService={notificationMoleConnectorServiceMock} />)
    await Promise.resolve(); // TODO: for a more nice version...

    // THEN
    expect(todoService.getTodos).toBeCalled();
    expect(todoSmartComponent.find("TodoTable").length).toBe(1);
    expect(todoSmartComponent.find("TodoTable").attr("todos")).toBe(dummyData);

    const handleInputChangeFromComponent = todoSmartComponent.find("TodoTable").attr("handleInputChange")
    handleInputChangeFromComponent(1)(dummyEvent);
    await Promise.resolve(); // TODO: for a more nice version...
 
    const expectedChangedItem = {
      "id": 1,
      "text": "buy butter",
      "done": false,
    }
    expect(todoService.updateTodoItem).toBeCalledWith(expectedChangedItem);
  });

});
