export default class SortableTable {
  element;
  sortArrowElement;
  subElements = {};
  headerElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.createElement();
    this.createSortArrowElement();
    this.subElements = this.getSubElements();
    this.headerElements = this.getHeaderElements();
  }

  getBodyRowLink(rowData) {
    const categoryId = rowData.subcategory?.category?.id;
    const subcategoryId = rowData.subcategory?.id;
    const itemId = rowData.id;
    const segments = [categoryId, subcategoryId, itemId].filter(Boolean);

    return `/${segments.join('/')}`;
  }

  createSortArrowElement() {
    const sortArrowTemplate = `
      <span class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;

    const wrapper = document.createElement('div');

    wrapper.innerHTML = sortArrowTemplate;
    this.sortArrowElement = wrapper.firstElementChild;
  }

  createHeadTemplate({id, title, sortable} = {}) {
    return `
      <div
        class="sortable-table__cell"
        data-id="${id}"
        ${sortable ? 'data-sortable' : ''}
      >
        <span>${title}</span>
      </div>
    `;
  }

  createHeaderRowTemplate() {
    return this.headerConfig.map(head => this.createHeadTemplate(head)).join('');
  }

  createHeaderTemplate() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${ this.createHeaderRowTemplate() }
      </div>
    `;
  }

  createBodyRowCellTemplate({template, value} = {}) {
    return template
      ? template(value)
      : `<div class="sortable-table__cell">${value}</div>`;
  }

  createBodyRowTemplate(rowData) {
    const cells = this.headerConfig
      .map(({id, template}) => this.createBodyRowCellTemplate({template, value: rowData[id]}))
      .join('');

    return `
      <a href="${this.getBodyRowLink(rowData)}" class="sortable-table__row">
        ${cells}
      </a>
    `;
  }

  createBodyRowsTemplate(data) {
    return data.map((row) => this.createBodyRowTemplate(row)).join('');
  }

  createBodyTemplate() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.createBodyRowsTemplate(this.data)}
      </div>
    `;
  }

  createTemplate() {
    return `
      <div class="sortable-table">
        ${this.createHeaderTemplate()}
        ${this.createBodyTemplate()}
      </div>
    `;
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    return [...elements].reduce((result, element)=>({
      ...result,
      [element.dataset.element]: element
    }), {});
  }

  getHeaderElements() {
    const { header } = this.subElements;
    const elements = header.querySelectorAll('[data-id]');
    return [...elements].reduce((result, element)=>({
      ...result,
      [element.dataset.id]: element
    }), {});
  }

  toggleSortArrow(sortField, sortOrder) {
    Object.values(this.headerElements).forEach(head => {
      delete head.dataset.order;
    });

    if (sortField && sortOrder) {
      const sortHead = this.headerElements[sortField];
      sortHead.dataset.order = sortOrder;
      sortHead.append(this.sortArrowElement);
    } else {
      this.sortArrowElement.remove();
    }
  }

  updateBody(data) {
    this.subElements.body.innerHTML = this.createBodyRowsTemplate(data);
  }

  sort(sortField, sortOrder) {
    if (!sortField) {
      return;
    }

    const { headerConfig, data } = this;
    const { sortType, sortFunction } = headerConfig
      .find(({id}) => id === sortField) || {};

    const sortedData = this.sortData({
      data, sortField, sortOrder, sortType, sortFunction
    });

    this.toggleSortArrow(sortField, sortOrder);
    this.updateBody(sortedData);
  }

  sortData({data, sortField, sortOrder, sortType, sortFunction} = {}) {
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    return [...data].sort((_a, _b) => {
      const a = _a[sortField];
      const b = _b[sortField];

      if (sortFunction) {
        return sortFunction(a, b, sortOrder);
      }

      switch (sortType) {
      case 'string':
        return sortDirection * a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper' });
      case 'number':
        return sortDirection * (a - b);
      default:
        return sortDirection * (a - b);
      }
    });
  }

  createElement() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.createTemplate();
    this.element = wrapper.firstElementChild;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

