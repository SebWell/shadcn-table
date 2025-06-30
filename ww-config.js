export default {
  editor: {
    label: {
      en: 'Table',
      fr: 'Tableau'
    },
    icon: 'table',
    customStylePropertiesOrder: [
      'backgroundColor',
      'borderColor',
      'borderRadius',
      'borderWidth'
    ],
    customSettingsPropertiesOrder: [
      'data',
      'columns',
      'showHeader',
      'selectable',
      'rowKey',
      'caption',
      'showFooter',
      'emptyText'
    ]
  },
  properties: {
    data: {
      label: {
        en: 'Data',
        fr: 'Données'
      },
      type: 'Array',
      defaultValue: [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' }
      ],
      bindable: true,
      section: 'settings'
    },
    columns: {
      label: {
        en: 'Columns',
        fr: 'Colonnes'
      },
      type: 'Array',
      options: {
        item: {
          type: 'Object',
          options: {
            item: {
              key: {
                type: 'Text',
                options: {
                  placeholder: 'Column key (e.g., name, email)'
                }
              },
              label: {
                type: 'Text',
                options: {
                  placeholder: 'Column label'
                }
              },
              sortable: {
                type: 'OnOff',
                defaultValue: false
              },
              width: {
                type: 'Text',
                options: {
                  placeholder: 'Width (e.g., 200px, 20%)'
                }
              },
              align: {
                type: 'TextSelect',
                options: {
                  options: [
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                    { value: 'right', label: 'Right' }
                  ]
                },
                defaultValue: 'left'
              },
              type: {
                type: 'TextSelect',
                options: {
                  options: [
                    { value: 'text', label: 'Text' },
                    { value: 'number', label: 'Number' },
                    { value: 'date', label: 'Date' },
                    { value: 'currency', label: 'Currency' }
                  ]
                },
                defaultValue: 'text'
              },
              currency: {
                type: 'Text',
                defaultValue: 'USD',
                options: {
                  placeholder: 'Currency code (USD, EUR, etc.)'
                }
              },
              footer: {
                type: 'Text',
                options: {
                  placeholder: 'Footer text'
                }
              }
            }
          }
        }
      },
      defaultValue: [
        { key: 'id', label: 'ID', sortable: true, width: '80px' },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'status', label: 'Status', align: 'center' }
      ],
      bindable: true,
      section: 'settings'
    },
    showHeader: {
      label: {
        en: 'Show header',
        fr: 'Afficher l\'en-tête'
      },
      type: 'OnOff',
      defaultValue: true,
      bindable: true,
      section: 'settings'
    },
    selectable: {
      label: {
        en: 'Selectable rows',
        fr: 'Lignes sélectionnables'
      },
      type: 'OnOff',
      defaultValue: false,
      bindable: true,
      section: 'settings'
    },
    rowKey: {
      label: {
        en: 'Row key field',
        fr: 'Champ clé de ligne'
      },
      type: 'Text',
      defaultValue: 'id',
      bindable: true,
      section: 'settings',
      options: {
        placeholder: 'Field name to use as unique key'
      }
    },
    caption: {
      label: {
        en: 'Caption',
        fr: 'Légende'
      },
      type: 'Text',
      bindable: true,
      multiLang: true,
      section: 'settings'
    },
    showFooter: {
      label: {
        en: 'Show footer',
        fr: 'Afficher le pied de page'
      },
      type: 'OnOff',
      defaultValue: false,
      bindable: true,
      section: 'settings'
    },
    emptyText: {
      label: {
        en: 'Empty state text',
        fr: 'Texte d\'état vide'
      },
      type: 'Text',
      defaultValue: 'No data available',
      bindable: true,
      multiLang: true,
      section: 'settings'
    },
    customClass: {
      label: {
        en: 'Table CSS class',
        fr: 'Classe CSS du tableau'
      },
      type: 'Text',
      bindable: true,
      section: 'style'
    },
    containerClass: {
      label: {
        en: 'Container CSS class',
        fr: 'Classe CSS du conteneur'
      },
      type: 'Text',
      bindable: true,
      section: 'style'
    },
    headerClass: {
      label: {
        en: 'Header CSS class',
        fr: 'Classe CSS de l\'en-tête'
      },
      type: 'Text',
      bindable: true,
      section: 'style'
    },
    bodyClass: {
      label: {
        en: 'Body CSS class',
        fr: 'Classe CSS du corps'
      },
      type: 'Text',
      bindable: true,
      section: 'style'
    },
    footerClass: {
      label: {
        en: 'Footer CSS class',
        fr: 'Classe CSS du pied de page'
      },
      type: 'Text',
      bindable: true,
      section: 'style'
    },
    rowClass: {
      label: {
        en: 'Row CSS class',
        fr: 'Classe CSS des lignes'
      },
      type: 'Text',
      bindable: true,
      section: 'style'
    },
    cellClass: {
      label: {
        en: 'Cell CSS class',
        fr: 'Classe CSS des cellules'
      },
      type: 'Text',
      bindable: true,
      section: 'style'
    },
    headerCellClass: {
      label: {
        en: 'Header cell CSS class',
        fr: 'Classe CSS des cellules d\'en-tête'
      },
      type: 'Text',
      bindable: true,
      section: 'style'
    },
    footerCellClass: {
      label: {
        en: 'Footer cell CSS class',
        fr: 'Classe CSS des cellules de pied de page'
      },
      type: 'Text',
      bindable: true,
      section: 'style'
    }
  },
  triggerEvents: [
    {
      name: 'rowClick',
      label: {
        en: 'On row click',
        fr: 'Au clic sur une ligne'
      },
      event: {
        row: 'Clicked row data',
        index: 'Row index'
      }
    },
    {
      name: 'sort',
      label: {
        en: 'On sort',
        fr: 'Au tri'
      },
      event: {
        key: 'Sort column key',
        direction: 'Sort direction (asc/desc)'
      }
    },
    {
      name: 'selectionChange',
      label: {
        en: 'On selection change',
        fr: 'Au changement de sélection'
      },
      event: {
        selectedRows: 'Array of selected row data',
        selectedKeys: 'Array of selected row keys'
      }
    }
  ]
} 