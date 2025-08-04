import SortableTable from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTableEvents extends SortableTable {
  constructor(
    headerConfig,
    {
      data = [],
      sorted = {},
    } = {},
  ) {
    super(headerConfig, data);

    this.createListeners();
    this.sort(sorted.id, sorted.order);
  }

  onHeaderPointerdown = (event) => {
    const head = event.target.closest('[data-sortable]');

    if (!head) {
      return;
    }

    const sortField = head.dataset.id;
    const sortOrder = head.dataset.order === 'desc' ? 'asc' : 'desc';

    this.sort(sortField, sortOrder);
  }

  createListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onHeaderPointerdown);
  }

  removeListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.onHeaderPointerdown);
  }

  destroy() {
    super.destroy();
    this.removeListeners();
  }
}
