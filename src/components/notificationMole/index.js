import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';
import { normalize } from 'path';

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
