export default class NotificationMessage {
  static lastShowedMessage = null;

  element;
  #timer;

  constructor(
    message = 'Введите сообщение',
    {
      duration = 2000,
      type = 'success',
    } = {}
  ) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.render();
  }

  get formattedDuration() {
    const seconds = this.duration / 1000;
    return `${seconds}s`;
  }

  get rootClass() {
    return ['notification', this.type].join(' ');
  }

  getNotification() {
    return `
      <div class="${this.rootClass}" style="--value:${this.formattedDuration}">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getNotification();

    this.element = wrapper.firstElementChild;
  }

  show(root = document.body) {
    if (NotificationMessage.lastShowedMessage) {
      NotificationMessage.lastShowedMessage.remove();
    }

    NotificationMessage.lastShowedMessage = this;

    root.append(this.element);

    this.#timer = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove() {
    clearTimeout(this.#timer);
    this.element.remove();
    NotificationMessage.lastShowedMessage = null;
  }

  destroy() {
    this.remove();
  }
}
