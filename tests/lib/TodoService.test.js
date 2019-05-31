import { deep } from 'preact-render-spy';
import { todoService } from '../../src/lib/TodoService';

describe('TodoService', () => {

  it('getTodos should work', () => {
    // GIVEN

    // WHEN
    const result = todoService.getTodos();

    // THEN
    expect(result).toEqual([{
          "done": true,
          "id": 1,
          "text": "buy butter",
        }, {
          "done": false,
          "id": 2,
          "text": "call tax attorney",
        }
    ]);

  });

  // add more tests for get / put etc

});
