<template>
  <div :class="['table-container', content.containerClass]">
    <table :class="['table', content.customClass]">
      <!-- Caption -->
      <caption 
        v-if="content.caption"
        :class="['table-caption', content.captionClass]"
      >
        {{ content.caption }}
      </caption>

      <!-- Header -->
      <thead v-if="content.showHeader" :class="['table-header', content.headerClass]">
        <tr :class="['table-header-row', content.headerRowClass]">
          <!-- Selection checkbox -->
          <th 
            v-if="content.selectable"
            :class="['table-header-cell', 'table-checkbox-cell', content.checkboxCellClass]"
          >
            <input
              type="checkbox"
              :checked="allSelected"
              :indeterminate="someSelected"
              @change="toggleAll"
              class="table-checkbox"
              aria-label="Select all"
            />
          </th>

          <!-- Column headers -->
          <th
            v-for="(column, index) in tableColumns"
            :key="column.key || index"
            :class="[
              'table-header-cell',
              {
                'table-header-cell-sortable': column.sortable,
                'table-header-cell-center': column.align === 'center',
                'table-header-cell-right': column.align === 'right'
              },
              content.headerCellClass,
              column.headerClass
            ]"
            :style="column.width ? { width: column.width } : {}"
            @click="column.sortable && handleSort(column.key)"
          >
            <div class="table-header-content">
              <span>{{ column.label || column.key }}</span>
              <div 
                v-if="column.sortable"
                class="table-sort-icons"
              >
                <svg 
                  :class="[
                    'table-sort-icon',
                    {
                      'table-sort-icon-active': sortConfig.key === column.key && sortConfig.direction === 'asc',
                      'table-sort-icon-inactive': !(sortConfig.key === column.key && sortConfig.direction === 'asc')
                    }
                  ]"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
                <svg 
                  :class="[
                    'table-sort-icon',
                    'table-sort-icon-desc',
                    {
                      'table-sort-icon-active': sortConfig.key === column.key && sortConfig.direction === 'desc',
                      'table-sort-icon-inactive': !(sortConfig.key === column.key && sortConfig.direction === 'desc')
                    }
                  ]"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody :class="['table-body', content.bodyClass]">
        <tr
          v-for="(row, rowIndex) in sortedData"
          :key="getRowKey(row, rowIndex)"
          :class="[
            'table-row',
            {
              'table-row-selected': isRowSelected(row)
            },
            content.rowClass
          ]"
          @click="handleRowClick(row, rowIndex)"
        >
          <!-- Selection checkbox -->
          <td 
            v-if="content.selectable"
            :class="['table-cell', 'table-checkbox-cell', content.checkboxCellClass]"
          >
            <input
              type="checkbox"
              :checked="isRowSelected(row)"
              @change="(e) => toggleRow(row, e.target.checked)"
              @click.stop
              class="table-checkbox"
              :aria-label="`Select row ${rowIndex + 1}`"
            />
          </td>

          <!-- Data cells -->
          <td
            v-for="(column, columnIndex) in tableColumns"
            :key="column.key || columnIndex"
            :class="[
              'table-cell',
              {
                'table-cell-center': column.align === 'center',
                'table-cell-right': column.align === 'right'
              },
              content.cellClass,
              column.cellClass
            ]"
          >
            <!-- Custom cell renderer -->
            <wwElement 
              v-if="column.renderer" 
              v-bind="column.renderer"
              :content="{ ...column.renderer.content, value: getCellValue(row, column.key), row, rowIndex, column }"
            />
            <!-- Default cell content -->
            <span v-else>
              {{ formatCellValue(getCellValue(row, column.key), column) }}
            </span>
          </td>
        </tr>

        <!-- Empty state -->
        <tr v-if="sortedData.length === 0">
          <td 
            :colspan="totalColumns"
            :class="['table-empty-cell', content.emptyCellClass]"
          >
            {{ content.emptyText || 'No data available' }}
          </td>
        </tr>
      </tbody>

      <!-- Footer -->
      <tfoot v-if="content.showFooter" :class="['table-footer', content.footerClass]">
        <tr>
          <td 
            v-if="content.selectable"
            :class="['table-footer-cell', 'table-checkbox-cell', content.checkboxCellClass]"
          >
          </td>
          
          <td
            v-for="(column, index) in tableColumns"
            :key="column.key || index"
            :class="[
              'table-footer-cell',
              {
                'table-footer-cell-center': column.align === 'center',
                'table-footer-cell-right': column.align === 'right'
              },
              content.footerCellClass,
              column.footerClass
            ]"
          >
            {{ column.footer || '' }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { cn } from './cn.js'

export default {
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        data: [],
        columns: [],
        showHeader: true,
        showFooter: false,
        selectable: false,
        rowKey: 'id',
        caption: '',
        emptyText: 'No data available',
        customClass: '',
        containerClass: '',
        captionClass: '',
        headerClass: '',
        headerRowClass: '',
        headerCellClass: '',
        bodyClass: '',
        rowClass: '',
        cellClass: '',
        footerClass: '',
        footerCellClass: '',
        checkboxCellClass: '',
        emptyCellClass: ''
      })
    },
    wwEditorState: { type: Object, required: true }
  },
  data() {
    return {
      selectedRows: [],
      sortConfig: { key: '', direction: 'asc' }
    }
  },

  computed: {
    tableData() {
      return this.content.data || []
    },
    
    tableColumns() {
      return this.content.columns || []
    },
    
    totalColumns() {
      return this.tableColumns.length + (this.content.selectable ? 1 : 0)
    },

    sortedData() {
      if (!this.sortConfig.key) {
        return this.tableData
      }

      const sorted = [...this.tableData].sort((a, b) => {
        const aValue = this.getCellValue(a, this.sortConfig.key)
        const bValue = this.getCellValue(b, this.sortConfig.key)

        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue)
        }

        if (aValue < bValue) return -1
        if (aValue > bValue) return 1
        return 0
      })

      return this.sortConfig.direction === 'desc' ? sorted.reverse() : sorted
    },

    allSelected() {
      return this.tableData.length > 0 && this.selectedRows.length === this.tableData.length
    },

    someSelected() {
      return this.selectedRows.length > 0 && this.selectedRows.length < this.tableData.length
    }
  },

  watch: {
    modelValue: {
      handler(newValue) {
        if (Array.isArray(newValue)) {
          this.selectedRows = newValue.map((row, index) => this.getRowKey(row, index))
        }
      },
      deep: true
    }
  },
  
  methods: {
    cn,
    
    // Helper functions
    getCellValue(row, key) {
      if (!key) return ''
      
      // Support nested keys like 'user.name'
      const keys = key.split('.')
      let value = row
      
      for (const k of keys) {
        value = value?.[k]
        if (value === undefined || value === null) break
      }
      
      return value
    },

    formatCellValue(value, column) {
      if (value === null || value === undefined) return ''
      
      if (column.type === 'date' && value instanceof Date) {
        return value.toLocaleDateString()
      }
      
      if (column.type === 'currency' && typeof value === 'number') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: column.currency || 'USD'
        }).format(value)
      }
      
      if (column.type === 'number' && typeof value === 'number') {
        return value.toLocaleString()
      }
      
      return String(value)
    },

    getRowKey(row, index) {
      if (this.content.rowKey && row[this.content.rowKey]) {
        return row[this.content.rowKey]
      }
      return index
    },

    isRowSelected(row) {
      const key = this.getRowKey(row, this.tableData.indexOf(row))
      return this.selectedRows.includes(key)
    },

    // Methods
    handleSort(key) {
      if (this.sortConfig.key === key) {
        // Toggle direction
        this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc'
      } else {
        // New column
        this.sortConfig.key = key
        this.sortConfig.direction = 'asc'
      }
      
      this.$emit('sort', { key, direction: this.sortConfig.direction })
    },

    handleRowClick(row, index) {
      this.$emit('rowClick', { row, index })
    },

    toggleRow(row, selected) {
      const key = this.getRowKey(row, this.tableData.indexOf(row))
      
      if (selected) {
        if (!this.selectedRows.includes(key)) {
          this.selectedRows.push(key)
        }
      } else {
        const index = this.selectedRows.indexOf(key)
        if (index > -1) {
          this.selectedRows.splice(index, 1)
        }
      }
      
      this.emitSelectionChange()
    },

    toggleAll(event) {
      if (event.target.checked) {
        this.selectedRows = this.tableData.map((row, index) => this.getRowKey(row, index))
      } else {
        this.selectedRows = []
      }
      
      this.emitSelectionChange()
    },

    emitSelectionChange() {
      const selectedData = this.tableData.filter((row, index) => {
        const key = this.getRowKey(row, index)
        return this.selectedRows.includes(key)
      })
      
      this.$emit('update:modelValue', selectedData)
      this.$emit('selectionChange', {
        selectedRows: selectedData,
        selectedKeys: this.selectedRows
      })
    }
  }
}
</script>

<style>
/* Shadcn UI variables */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}

/* Table Styles */
.table-container {
  position: relative;
  width: 100%;
  overflow: auto;
}

.table {
  width: 100%;
  caption-side: bottom;
  font-size: 0.875rem;
}

.table-caption {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
}

.table-header tr {
  border-bottom: 1px solid hsl(var(--border));
}

.table-header-row {
  border-bottom: 1px solid hsl(var(--border));
  transition: colors 0.2s;
}

.table-header-row:hover {
  background-color: hsl(var(--muted) / 0.5);
}

.table-header-cell {
  height: 3rem;
  padding: 0 1rem;
  text-align: left;
  vertical-align: middle;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
}

.table-header-cell-sortable {
  cursor: pointer;
  user-select: none;
}

.table-header-cell-sortable:hover {
  color: hsl(var(--foreground));
}

.table-header-cell-center {
  text-align: center;
}

.table-header-cell-right {
  text-align: right;
}

.table-checkbox-cell {
  padding-right: 0 !important;
}

.table-header-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-sort-icons {
  display: flex;
  flex-direction: column;
}

.table-sort-icon {
  height: 0.75rem;
  width: 0.75rem;
  transition: opacity 0.2s;
}

.table-sort-icon-desc {
  margin-top: -0.25rem;
}

.table-sort-icon-active {
  opacity: 1;
}

.table-sort-icon-inactive {
  opacity: 0.5;
}

.table-body tr:last-child {
  border-bottom: none;
}

.table-row {
  border-bottom: 1px solid hsl(var(--border));
  transition: colors 0.2s;
}

.table-row:hover {
  background-color: hsl(var(--muted) / 0.5);
}

.table-row-selected {
  background-color: hsl(var(--muted));
}

.table-cell {
  padding: 1rem;
  vertical-align: middle;
}

.table-cell-center {
  text-align: center;
}

.table-cell-right {
  text-align: right;
}

.table-empty-cell {
  padding: 2rem;
  text-align: center;
  color: hsl(var(--muted-foreground));
}

.table-footer {
  border-top: 1px solid hsl(var(--border));
  background-color: hsl(var(--muted) / 0.5);
  font-weight: 500;
}

.table-footer tr:last-child {
  border-bottom: none;
}

.table-footer-cell {
  padding: 1rem;
  vertical-align: middle;
  font-weight: 500;
}

.table-footer-cell-center {
  text-align: center;
}

.table-footer-cell-right {
  text-align: right;
}

.table-checkbox {
  height: 1rem;
  width: 1rem;
  border-radius: calc(var(--radius) - 2px);
  border: 1px solid hsl(var(--primary));
  color: hsl(var(--primary));
  background-color: hsl(var(--background));
  cursor: pointer;
}

.table-checkbox:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--ring)), 0 0 0 4px hsl(var(--background));
}

.table-checkbox:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style> 