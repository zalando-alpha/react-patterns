import { shallow } from 'preact-render-spy';
import TodoTable from '../../../src/routes/todoSmartComponent/TodoTable';

describe('TodoTable', () => {

  test('should render properly', async () => {
    // GIVEN
    const dummyTodos = [{
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

    const handleInputChange = (id) => { 
      return jest.fn();
    }

    // WHEN
    const todoTable = shallow(<TodoTable todos={dummyTodos} handleInputChange={handleInputChange} />)
    await Promise.resolve(); // TODO: for a more nice version...

    // THEN
    expect(todoTable.find("tr").length).toBe(2);

    const firstItemHtml = todoTable.find("tr").at(0);
    expect(firstItemHtml.find("td").at(0).text()).toEqual(dummyTodos[0].id + "");
    expect(firstItemHtml.find("td").at(1).text()).toEqual(dummyTodos[0].text);
    expect(firstItemHtml.find("td").at(2).find("input").at(0).attr("checked")).toEqual(dummyTodos[0].done);
  
    const secondItemHtml = todoTable.find("tr").at(1);
    expect(secondItemHtml.find("td").at(0).text()).toEqual(dummyTodos[1].id + "");
    expect(secondItemHtml.find("td").at(1).text()).toEqual(dummyTodos[1].text);
    expect(secondItemHtml.find("td").at(2).find("input").at(0).attr("checked")).toEqual(dummyTodos[1].done);
  });

  test('should properly forward change events on the checkbox', async () => {
    // GIVEN
    const dummyTodos = [{
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

    const idHandlerMap = {};
    const handleInputChange = id => {
      // we save the function into the idHandlerMap, so can verify later that the binding
      // of the ids was correct.
      const jestFunction = jest.fn();
      idHandlerMap[id+""] = {
        function: jestFunction
      };
      return jestFunction;
    }

    // WHEN
    const todoTable = shallow(<TodoTable todos={dummyTodos} handleInputChange={handleInputChange} />)
    await Promise.resolve(); // TODO: for a more nice version...

    // THEN
    expect(todoTable.find("tr").length).toBe(2);

    // we click around a bit and check that the correct function has been triggered
    const firstCheckBox = todoTable.find("tr").at(0).find("td").at(2).find("input").at(0);
    firstCheckBox.simulate('change');
    expect(idHandlerMap["1"].function.mock.calls.length).toEqual(1);
    expect(idHandlerMap["42"].function.mock.calls.length).toEqual(0);

    firstCheckBox.simulate('change');
    expect(idHandlerMap["1"].function.mock.calls.length).toEqual(2);
    expect(idHandlerMap["42"].function.mock.calls.length).toEqual(0);

    const secondCheckBox = todoTable.find("tr").at(1).find("td").at(2).find("input").at(0);
    secondCheckBox.simulate('change');
    expect(idHandlerMap["1"].function.mock.calls.length).toEqual(2);
    expect(idHandlerMap["42"].function.mock.calls.length).toEqual(1);

    secondCheckBox.simulate('change');
    expect(idHandlerMap["1"].function.mock.calls.length).toEqual(2);
    expect(idHandlerMap["42"].function.mock.calls.length).toEqual(2);
  });

});
