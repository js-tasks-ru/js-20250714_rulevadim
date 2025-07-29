export default class ColumnChart {
  element;
  chartHeight = 50;

  constructor(props = {}) {
    const {
      data = [],
      label = '',
      value = 0,
      link = '',
      formatHeading = (value) => value
    } = props;
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.element = this.createElement();
    this.updateLoadingState();
  }

  createLinkTemplate() {
    return this.link
      ? `<a href="/${this.link}" class="column-chart__link">View all</a>`
      : '';
  }

  getColumnProps() {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return this.data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  createChartTemplate() {
    const columnProps = this.getColumnProps();

    return columnProps
      .map(({value, percent}) => `<div style="--value: ${value}" data-tooltip="${percent}"></div>`)
      .join('');
  }

  updateChartTemplate() {
    const element = this.element.querySelector('[data-element=body]');
    element.innerHTML = this.createChartTemplate();
  }

  updateLoadingState() {
    const isLoading = !this.data.length;

    if (isLoading) {
      this.element.classList.add('column-chart_loading');
    } else {
      this.element.classList.remove('column-chart_loading');
    }
  }

  createTemplate() {
    return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          ${this.createLinkTemplate()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.formatHeading(this.value)}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.createChartTemplate()}
          </div>
        </div>
      </div>
    `;
  }

  createElement() {
    const element = document.createElement('div');

    element.innerHTML = this.createTemplate();

    const {firstElementChild} = element;

    return firstElementChild;
  }

  update(newData) {
    this.data = newData;
    this.updateChartTemplate();
    this.updateLoadingState();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
