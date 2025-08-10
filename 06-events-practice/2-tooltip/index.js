export default class Tooltip {
  static #instance;
  element;

  constructor() {
    if (Tooltip.#instance) {
      return Tooltip.#instance;
    }

    Tooltip.#instance = this;
    this.createElement();
  }

  createTemplate() {
    return `
      <div class="tooltip"></div>
    `;
  }

  createElement() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.createTemplate();

    this.element = wrapper.firstElementChild;
  }

  render(text) {
    this.element.textContent = text;
    document.body.append(this.element);
  }

  moveTooltip = ({x = 0, y = 0} = {}) => {
    this.element.style.left = x + 'px';
    this.element.style.top = y + 'px';
  }

  onDocumentPointerover = (event) => {
    const tooltipTarget = event.target.closest('[data-tooltip]');

    if (tooltipTarget) {
      this.render(tooltipTarget.dataset.tooltip);
      document.addEventListener('pointermove', this.moveTooltip);
    }
  }

  onDocumentPointerout = (event) => {
    const tooltipTarget = event.target.closest('[data-tooltip]');

    if (tooltipTarget) {
      this.remove();
      document.removeEventListener('pointermove', this.moveTooltip);
    }
  }

  createListeners() {
    document.addEventListener('pointerover', this.onDocumentPointerover);
    document.addEventListener('pointerout', this.onDocumentPointerout);
  }

  initialize () {
    this.createListeners();
  }

  remove() {
    this.element.remove();
  }

  removeListeners() {
    document.addEventListener('pointerover', this.onDocumentPointerover);
    document.addEventListener('pointerout', this.onDocumentPointerout);
    document.addEventListener('pointermove', this.moveTooltip);
  }

  destroy() {
    this.remove();
    this.removeListeners();
  }
}
