import { shallow } from 'preact-render-spy';
import TodoSmartComponent from '../../../src/routes/todoSmartComponent/TodoSmartComponent';

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

    const todoServiceMock = {
      getTodos: jest.fn(() => dummyData)
    };

    // WHEN
    const todoSmartComponent = shallow(<TodoSmartComponent todoService={todoServiceMock} />)
    await Promise.resolve(); // TODO: for a more nice version...

    // THEN
    expect(todoServiceMock.getTodos).toBeCalled();
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

    const todoServiceMock = {
      getTodos: jest.fn(() => dummyData),
      updateTodoItem: jest.fn(() => [])
    };
    const notificationMoleConnectorServiceMock = {
      showNotification: jest.fn()
    };

    // WHEN
    const todoSmartComponent = shallow(<TodoSmartComponent todoService={todoServiceMock} notificationMoleConnectorService={notificationMoleConnectorServiceMock} />)
    await Promise.resolve(); // TODO: for a more nice version...

    // THEN
    expect(todoServiceMock.getTodos).toBeCalled();
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
    expect(todoServiceMock.updateTodoItem).toBeCalledWith(expectedChangedItem);
  });

});
