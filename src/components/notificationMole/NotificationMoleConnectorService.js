export default class NotificationMoleConnectorService {
  
  connect(component) {
    this.component = component;
    console.log("connected!");
  }

  showNotification(text) {
    this.component.setState({ notification: text });

    // remove notification after 3 secs
    setTimeout(() => {
      this.component.setState({ notification: "" });
    }, 3000);

  }

}