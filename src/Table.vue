<template>
  <div :class="cn('relative w-full overflow-auto', content.containerClass)">
    <table :class="cn('w-full caption-bottom text-sm', content.customClass)">
      <!-- Caption -->
      <caption 
        v-if="content.caption"
        :class="cn('mt-4 text-sm text-muted-foreground', content.captionClass)"
      >
        {{ content.caption }}
      </caption>

      <!-- Header -->
      <thead v-if="showHeader" :class="cn('[&_tr]:border-b', content.headerClass)">
        <tr :class="cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', content.headerRowClass)">
          <!-- Selection checkbox -->
          <th 
            v-if="content.selectable"
            :class="cn('h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0', content.checkboxCellClass)"
          >
            <input
              type="checkbox"
              :checked="allSelected"
              :indeterminate="someSelected"
              @change="toggleAll"
              :class="cn('h-4 w-4 rounded border border-primary text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50')"
              aria-label="Select all"
            />
          </th>

          <!-- Column headers -->
          <th
            v-for="(column, index) in columns"
            :key="column.key || index"
            :class="cn(
              'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
              column.sortable && 'cursor-pointer select-none hover:text-foreground',
              column.width && `w-[${column.width}]`,
              column.align === 'center' && 'text-center',
              column.align === 'right' && 'text-right',
              content.headerCellClass,
              column.headerClass
            )"
            @click="column.sortable && handleSort(column.key)"
          >
            <div class="flex items-center space-x-2">
              <span>{{ column.label || column.key }}</span>
              <div 
                v-if="column.sortable"
                class="flex flex-col"
              >
                <svg 
                  :class="cn('h-3 w-3 transition-opacity', sortConfig.key === column.key && sortConfig.direction === 'asc' ? 'opacity-100' : 'opacity-50')"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
                <svg 
                  :class="cn('h-3 w-3 transition-opacity -mt-1', sortConfig.key === column.key && sortConfig.direction === 'desc' ? 'opacity-100' : 'opacity-50')"
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
      <tbody :class="cn('[&_tr:last-child]:border-0', content.bodyClass)">
        <tr
          v-for="(row, rowIndex) in sortedData"
          :key="getRowKey(row, rowIndex)"
          :class="cn(
            'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
            isRowSelected(row) && 'bg-muted',
            content.rowClass
          )"
          @click="handleRowClick(row, rowIndex)"
        >
          <!-- Selection checkbox -->
          <td 
            v-if="content.selectable"
            :class="cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', content.checkboxCellClass)"
          >
            <input
              type="checkbox"
              :checked="isRowSelected(row)"
              @change="(e) => toggleRow(row, e.target.checked)"
              @click.stop
              :class="cn('h-4 w-4 rounded border border-primary text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50')"
              :aria-label="`Select row ${rowIndex + 1}`"
            />
          </td>

          <!-- Data cells -->
          <td
            v-for="(column, columnIndex) in columns"
            :key="column.key || columnIndex"
            :class="cn(
              'p-4 align-middle',
              column.align === 'center' && 'text-center',
              column.align === 'right' && 'text-right',
              content.cellClass,
              column.cellClass
            )"
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
            :class="cn('p-8 text-center text-muted-foreground', content.emptyCellClass)"
          >
            {{ content.emptyText || 'No data available' }}
          </td>
        </tr>
      </tbody>

      <!-- Footer -->
      <tfoot v-if="content.showFooter" :class="cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', content.footerClass)">
        <tr>
          <td 
            v-if="content.selectable"
            :class="cn('p-4 align-middle', content.checkboxCellClass)"
          >
          </td>
          
          <td
            v-for="(column, index) in columns"
            :key="column.key || index"
            :class="cn(
              'p-4 align-middle font-medium',
              column.align === 'center' && 'text-center',
              column.align === 'right' && 'text-right',
              content.footerCellClass,
              column.footerClass
            )"
          >
            {{ column.footer || '' }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { cn } from './cn.js'

const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  },
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'rowClick', 'sort', 'selectionChange'])

// Refs
const selectedRows = ref([])
const sortConfig = ref({ key: '', direction: 'asc' })

// Computed properties
const data = computed(() => props.content.data || [])
const columns = computed(() => props.content.columns || [])
const showHeader = computed(() => props.content.showHeader !== false)
const totalColumns = computed(() => columns.value.length + (props.content.selectable ? 1 : 0))

const sortedData = computed(() => {
  if (!sortConfig.value.key) {
    return data.value
  }

  const sorted = [...data.value].sort((a, b) => {
    const aValue = getCellValue(a, sortConfig.value.key)
    const bValue = getCellValue(b, sortConfig.value.key)

    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue)
    }

    if (aValue < bValue) return -1
    if (aValue > bValue) return 1
    return 0
  })

  return sortConfig.value.direction === 'desc' ? sorted.reverse() : sorted
})

const allSelected = computed(() => {
  return data.value.length > 0 && selectedRows.value.length === data.value.length
})

const someSelected = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.length < data.value.length
})

// Helper functions
const getCellValue = (row, key) => {
  if (!key) return ''
  
  // Support nested keys like 'user.name'
  const keys = key.split('.')
  let value = row
  
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined || value === null) break
  }
  
  return value
}

const formatCellValue = (value, column) => {
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
}

const getRowKey = (row, index) => {
  if (props.content.rowKey && row[props.content.rowKey]) {
    return row[props.content.rowKey]
  }
  return index
}

const isRowSelected = (row) => {
  const key = getRowKey(row, data.value.indexOf(row))
  return selectedRows.value.includes(key)
}

// Methods
const handleSort = (key) => {
  if (sortConfig.value.key === key) {
    // Toggle direction
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    // New column
    sortConfig.value.key = key
    sortConfig.value.direction = 'asc'
  }
  
  emit('sort', { key, direction: sortConfig.value.direction })
}

const handleRowClick = (row, index) => {
  emit('rowClick', { row, index })
}

const toggleRow = (row, selected) => {
  const key = getRowKey(row, data.value.indexOf(row))
  
  if (selected) {
    if (!selectedRows.value.includes(key)) {
      selectedRows.value.push(key)
    }
  } else {
    const index = selectedRows.value.indexOf(key)
    if (index > -1) {
      selectedRows.value.splice(index, 1)
    }
  }
  
  emitSelectionChange()
}

const toggleAll = (event) => {
  if (event.target.checked) {
    selectedRows.value = data.value.map((row, index) => getRowKey(row, index))
  } else {
    selectedRows.value = []
  }
  
  emitSelectionChange()
}

const emitSelectionChange = () => {
  const selectedData = data.value.filter((row, index) => {
    const key = getRowKey(row, index)
    return selectedRows.value.includes(key)
  })
  
  emit('update:modelValue', selectedData)
  emit('selectionChange', {
    selectedRows: selectedData,
    selectedKeys: selectedRows.value
  })
}

// Watch for external selection changes
watch(() => props.modelValue, (newValue) => {
  if (Array.isArray(newValue)) {
    selectedRows.value = newValue.map((row, index) => getRowKey(row, index))
  }
}, { deep: true })
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 