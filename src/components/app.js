import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import TodoSmartComponent from '../routes/todoSmartComponent/TodoSmartComponent';
import TodoService from '../lib/TodoService';
import NotificationMole from './notificationMole';
import NotificationMoleConnectorService from './notificationMole/NotificationMoleConnectorService';
// import Home from 'async!./home';
// import Profile from 'async!./profile';

export default class App extends Component {

  constructor() {
    super();
    this.notificationMoleConnectorService = new NotificationMoleConnectorService();
  }

  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  render() {
    return (
      <div id="app">
        <Header />
        <NotificationMole notificationMoleConnectorService={this.notificationMoleConnectorService} />
        <Router onChange={this.handleRoute}>
          <TodoSmartComponent path="/todo" notificationMoleConnectorService={this.notificationMoleConnectorService} />
        </Router>
      </div>
    );
  }
}
