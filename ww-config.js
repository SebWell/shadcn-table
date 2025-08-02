export default {
    editor: {
        label: 'Shadcn Table',
        icon: 'table',
    },
    triggerEvents: [
        { name: 'rowClick', label: 'On Row Click', event: { row: {}, index: 0 } },
        { name: 'sort', label: 'On Sort', event: { key: '', direction: 'asc' } },
        { name: 'selectionChange', label: 'On Selection Change', event: { selectedRows: [], selectedKeys: [] } }
    ],
    properties: {
        data: {
            label: 'Data',
            type: 'Array',
            section: 'settings',
            bindable: true,
            defaultValue: []
        },
        columns: {
            label: 'Columns',
            type: 'Array',
            section: 'settings',
            bindable: true,
            defaultValue: []
        },
        selectable: {
            label: 'Selectable rows',
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false
        },
        showHeader: {
            label: 'Show header',
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: true
        },
        showFooter: {
            label: 'Show footer',
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false
        },
        caption: {
            label: 'Caption',
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: ''
        },
        emptyText: {
            label: 'Empty state text',
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: 'No data available'
        },
        rowKey: {
            label: 'Row key field',
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: 'id'
        },
        containerClass: {
            label: 'Container CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        customClass: {
            label: 'Table CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        headerClass: {
            label: 'Header CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        bodyClass: {
            label: 'Body CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        footerClass: {
            label: 'Footer CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        rowClass: {
            label: 'Row CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        },
        cellClass: {
            label: 'Cell CSS classes',
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: ''
        }
    }
};
