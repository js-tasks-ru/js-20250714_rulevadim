export default class SortableTable {
  element;
  subElements = {};
  headerElements = {};
  sortField;
  sortType;
  sortOrder;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.render();
  }

  get sortTypesMap() {
    const entries = this.headerConfig
      .filter(({sortable}) => sortable)
      .map(({id, sortType}) => [id, sortType]);

    return Object.fromEntries(entries);
  }

  get sortedData() {
    const { data, sortField, sortType, sortOrder } = this;

    if (!sortField) {
      return this.data;
    }

    return this.sortData({ data, sortField, sortOrder, sortType});
  }

  getHead({id, title, sortable} = {}) {
    const sortArrow = `
      <span class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;

    return `
      <div
        class="sortable-table__cell"
        data-id="${id}"
        data-sortable="${sortable}"
      >
        <span>${title}</span>
        ${sortable ? sortArrow : ''}
      </div>
    `;
  }

  getHeaderRow() {
    return this.headerConfig.map(head => this.getHead(head)).join('');
  }

  getHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${ this.getHeaderRow() }
      </div>
    `;
  }

  getBodyRowLink(rowData) {
    const categoryId = rowData.subcategory?.category?.id;
    const subcategoryId = rowData.subcategory?.id;
    const itemId = rowData.id;
    const segments = [categoryId, subcategoryId, itemId].filter(Boolean);

    return `/${segments.join('/')}`;
  }

  getBodyRowCell({template, value} = {}) {
    return template
      ? template(value)
      : `<div class="sortable-table__cell">${value}</div>`;
  }

  getBodyRow(rowData) {
    const cells = this.headerConfig
      .map(({id, template}) => this.getBodyRowCell({template, value: rowData[id]}))
      .join('');

    return `
      <a href="${this.getBodyRowLink(rowData)}" class="sortable-table__row">
        ${cells}
      </a>
    `;
  }

  getBodyRows() {
    return this.sortedData.map((row) => this.getBodyRow(row)).join('');
  }

  getBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getBodyRows()}
      </div>
    `;
  }

  getTable() {
    return `
      <div class="sortable-table">
        ${this.getHeader()}
        ${this.getBody()}
      </div>
    `;
  }

  getSubElements(root) {
    const elements = root.querySelectorAll('[data-element]');
    return [...elements].reduce((result, element)=>({
      ...result,
      [element.dataset.element]: element
    }), {});
  }

  getHeaderElements(header) {
    const elements = header.querySelectorAll('[data-id]');
    return [...elements].reduce((result, element)=>({
      ...result,
      [element.dataset.id]: element
    }), {});
  }

  toggleSortArrow() {
    const {sortField, sortOrder} = this;

    Object.values(this.headerElements).forEach((head) => {
      head.dataset.order = '';
    });

    if (sortField && sortOrder) {
      this.headerElements[sortField].dataset.order = sortOrder;
    }
  }

  updateBody() {
    this.subElements.body.innerHTML = this.getBodyRows();
  }

  async sort(sortField, sortOrder = 'asc') {
    this.sortField = sortField;
    this.sortOrder = sortOrder;
    this.sortType = this.sortTypesMap[sortField];

    this.toggleSortArrow();
    this.updateBody();
  }

  sortData({data, sortField, sortOrder, sortType} = {}) {
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    return [...data].sort((_a, _b) => {
      const a = _a[sortField];
      const b = _b[sortField];

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

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTable();
    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);
    this.headerElements = this.getHeaderElements(this.subElements.header);
  }

  destroy() {
    this.element.remove();
    this.element = null;
    this.subElements = {};
    this.headerElements = {};
    this.sortField = undefined;
    this.sortOrder = undefined;
    this.sortType = undefined;
  }
}

