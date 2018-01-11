React patterns for fun and profit
=================================

This is the basis for a blogpost published on the Zalando Tech blog.

Bulding and running the project with npm (5.5 onwards) is as simple as:
```
  npm install
  npm run dev
  npm run test
```
Prerequisites
-------------

If you are interested how to architect large real world React applications with minimal dependencies (no redux) then this is for you.
The examples are based on preact, jest and preact-render-spy, but preact is basically react and preact-render-spy is basically enzyme, so you can translate the examples 1:1.

Example project with tests can be found [here](https://github.com/zalando-alpha/react-patterns).

A note of warning: While we found the following patterns to be useful - we are super interested in getting your feedback.

Introduction
------------

While React is called framework, it is much less of a framework than, say, Angular or Arelia. It does NOT feature dependency injection. It does NOT tell you how to test by default. It does NOT give you best practises how to organise your application in general. And it encourages to mix business logic with view logic in a fatal way - because you know - everything is just a component.

In short React is basically a clever rendering framework. And if you want to write an application, you have to find ways to write the rest of the application.
Whole books have been written about MVP, MVC, MVVM and more (I’ll refer to that class of patterns as MVP pattern in the following). But React is silent on these topics. Everything is a component. 

Sure, there are redux, mobx and other state managers but they likely introduce a class of new problems that [you](https://medium.com/static-dev/you-probably-dont-need-react-redux-ce2d7688f571) [don’t](https://medium.com/@blairanderson/you-probably-dont-need-redux-1b404204a07f) [want](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) to have in the first place.

Coming back to these old school patterns - why do they actually exist?
Simple: Testability and simplicity which lead to maintainable applications.
Let’s talk about some very basic patterns that you can follow to achieve testability and simplicity. We found the following patterns to be very useful. Maybe they are useful for you as well.


SmartComponent / DumbComponent Pattern (SD Pattern)
---------------------------------------------------

As discussed above all the traditional patterns have some part where the logic is (Presenter or Controller), and a part where the rendering happens (View).
With react you naturally have a) components that have state. And b) components that just render stuff without any state. 

We call them:
- SmartComponents (with state) and 
- DumbComponents (without state, usually just a function).

The best practise is to have few SmartComponents and a many many DumbComponents. The state of the application is then centralised in few SmartComponent and rendered by many DumbComponents. Often, one route is represented by one SmartComponent.

Let’s consider a Todo application. You got the page that renders the Todo application. That’s a SmartComponent. It maintains the state of the individual items. It knows the backend services to call when the user clicks somewhere to create or update anything. And it can even talk to other parts of the application to display “success” messages when needed.

```javascript
export default class TodoSmartComponent extends Component {

  constructor(props) {
    super(props);
    this.todoService = props.todoService;
    this.state = {
      todos: []
    };
  }

  componentDidMount() {
    // some business logic
  }

  handleInputChange = (id) => (event) => {
    // some business logic
  }

  showInputField = () => {
    // some business logic
  }

  _loadData() {
    // some business logic
  }

  render() {
    // very simple rendering. It simply forwards stuff to the dumb components (TodoValue)

    return (
      <div class={style.content}>
        <h1>My TODO items</h1>
        <TodoTable todos={this.state.todos} handleInputChange={this.handleInputChange} />
        <input value="Create new item" type="button" onClick={this.showInputField} />
      </div>
    );
  }
```

The individual table that then displays the state is just a DumbComponent rendering it. The DumbComponents also just forward any clicks to the SmartComponent.

That makes it straight forward to test. If you want to know what is going in terms of business logic just look at the SmartComponent. No need to understand how those many small components maintain their state. There is one component handling the state. Period.

```javascript
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

  // THEN
  expect(todoServiceMock.getTodos).toBeCalled();
  expect(todoSmartComponent.find("TodoTable").length).toBe(1);
  expect(todoSmartComponent.find("TodoTable").attr("todos")).toBe(dummyData);
});
```

The key to testing is to (almost) always use shallow rendering. Enzyme supports [that](https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md) and also the preact-render-spy we use in the example.

When you need deep rendering (rendering a while component tree with many dependencies) then your application code tells you: "Hey. Refactor me. I am too complicated. Bloated. Make me shallow-testable".

Shallow vs deep rendering in tests is similar to unit tests vs. integration tests. 
If a unit test goes wrong you know exactly where the problem is. If an integration test goes wrong you often have to look for the problem in many services, views and controllers that the integration test involves.

Therefore shallow rendering is always preferable to deep rendering.

### Key Takeaways:
- Use components that maintain state very very rarely (SmartComponents)
- Most components should just render things and forward events (DumbComponents)
- Use shallow rendering to test your business logic (SmartComponents) and the views (DumbComponents) in a unit-testing fashion
- Tests for DumbComponents just test rendering and the correct wiring of event handlers.
- Tests for SmartComponents mainly test business logic and that event handlers trigger the correct setState updates.
- SmartComponents are best used with external services provided via props. Check out the following patterns for more.


Props Instance Pattern (PI Pattern)
-----------------------------------

We discussed SmartComponents. They contain business logic. They will calculate something using a service, and they will likely talk to your backend server to update or create something.

But somehow you have to provide the service to your SmartComponent. How does that work nicely?

We found it a nice pattern to instantiate the services in one place and then forward them to the SmartComponents via props.

```javascript
export default class App extends Component {

  constructor() {
    super();
    // here we instantiate the services
    // and we provide them via props to the React components: <MyComponent todoService={this.todoService} />
    this.todoService = new TodoService();
  }
  
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  render() {
    return (
      <div id="app">
        <Header />
        <Router onChange={this.handleRoute}>
          <TodoSmartComponent path="/todo" todoService={this.todoService} />
        </Router>
      </div>
    );
  }
}
```

If you then want to test the SmartComponent you can simply use the props to provide a mocked implementation.
This pattern is much related to what [others](http://inversify.io/) refer to as [Dependency Injection or Inversion of Control](https://en.wikipedia.org/wiki/Dependency_injection). Our approach is not the same because we still have to create the instances manually. We found it not to be a big deal for now. The cool thing is that we don’t need another framework dependency we just create the instances and wire them up. Done.

```javascript
test('should load data on mount...', async () => {
  // GIVEN
  // our mock we control...
  const todoServiceMock = {
    getTodos: jest.fn(() => dummyData)
  };

  // WHEN
  const todoSmartComponent = shallow(<TodoSmartComponent todoService={todoServiceMock} />)

  // THEN
  // test some stuff
});
```

That keeps stuff testable and simple - again. In tests we can provide external services and mock them.  That allows to control responses and verify calls to services exhaustively. 

### Key takeaways:
- Provide instances via properties to share them between SmartComponents
- Create instances in one place (likely the file containing the routes).


Service Pattern (S Pattern)
---------------------------

The service pattern makes only sense together with the Props Instance (PI) Pattern. 
Services encapsulate business logic. They don’t render anything.

A good example are services that allow to call backend services via the fetch api. You can test these services individually. These service do not hold any state.

### Key takeaways:
- Use the service pattern to encapsulate business logic
- Use the service pattern to encapsulate fetch calls to external services


Connector Service Pattern (CS Pattern)
--------------------------------------

The SmartService Pattern is extension of the Service Pattern. Sometimes different react components have to talk to each other. 
We found it a good pattern having a Connector Service that is shared between the Component that displays something and the other SmartComponent that wants to do something somewhere else.

Let’s talk about a concrete example: A NotificationMole.

Our Todo application has one view where the user can select / deselect certain items to mark them as done / todo. That’s a SmartComponent called TodoSmartComponent.

If we now want to display a notification that the new state has been sent to the server we typically use some kind of notification mole that can be triggered by many different components.

But how can the SmartComponent send something to the NotificationMole?

Simple. We have a ConnectorService (NotificationMoleConnectorService) that knows its react view - in that case NotificationMole.The NotificationMoleConnectorService is shared between producers (TodoSmartComponent) and the view that displays things: NotificationMole.

```javascript
export default class NotificationMole extends Component {

  constructor(props) {
    super();
    this.notificationMoleConnectorService = props.notificationMoleConnectorService;
    this.notificationMoleConnectorService.connect(this);
  }

  render() {
    const notification = this.state.notification;

    if (notification !== undefined && notification !== "") {
      return (
        <div class={style.notificationMole} >
          {this.state.notification}
        </div>
      );
    } else {
      return null;
    }

  }
}

```

And that's the NotificationMoleConnectorService.

```javascript
export default class NotificationMoleConnectorService {
  
  connect(component) {
    this.component = component;
  }

  // this is the method that can be called from components that want to trigger a message to be displayed.
  showNotification(text) {
    this.component.setState({ notification: text });

    // remove notification after 3 secs
    setTimeout(() => {
      this.component.setState({ notification: "" });
    }, 3000);

  }

}
```

The Props Instance Patterns provides the ConnectorService to all interested parties.

```javascript
export default class App extends Component {

  constructor() {
    super();
    // Used by both NotificationMole and TodoSmartComponent and provided via props
    this.notificationMoleConnectorService = new NotificationMoleConnectorService();

  }

  //...

  render() {
    return (
      <div id="app">
        <Header />
        <NotificationMole notificationMoleConnectorService={this.notificationMoleConnectorService} />
        <Router onChange={this.handleRoute}>
          <TodoSmartComponent notificationMoleConnectorService={this.notificationMoleConnectorService} />
        </Router>
      </div>
    );
  }
}
```

TodoSmartComponent can then show something simply by calling notificationMoleConnectorService.showNotfication(“Item has been disabled”). 
This is beautiful when you want to test the TodoSmartComponent. You can mock the NotificationMoleConnectorService, provide it the mock via the props and simply verify in your test scenario that the correct method has been called.

The notification service itself can also be tested easily. One test of the NotificationMoleConnectorService and one test of the NotificationMole itself. 
This concept is similar to Smart- and DumbComponents. NotificationMoleConnectorService is similar to a SmartComponent having the state. NotificationMole is simiilar to a DumbComponent. NotificationMole just gets triggered by the NotificationMoleConnectorService.

It’s still different to the Smart- /Dumbcomponents concept because NotificationMoleConnectorService is not a react component. We wire it via the Props Instance Pattern and therefore can control it.

### Key takeaways:
- When components want to communicate then use a React component that is backed by a service. 
- That connector service is created via the Props Injection Pattern and provided to the react view that it controls
- It is also provided via the Props Injection Pattern to other SmartComponents which then can trigger something - like showing a notification in a mole.


