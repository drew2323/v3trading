<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useLayoutStore } from '@/stores/layoutStore'
import Plotly from 'plotly.js-dist'

const layoutStore = useLayoutStore()

interface Props {
  width?: number
  height?: number
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: undefined,
  height: 600,
  title: '3D Visualization'
})

const plotContainer = ref<HTMLElement>()
const resizeObserver = ref<ResizeObserver | null>(null)

// Helper function to read CSS variables from the active theme
const getCSSVariable = (varName: string): string => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim()
}

// Generate 3D surface data: z = sin(x) * cos(y)
const generateSurfaceData = () => {
  const size = 50
  const x = []
  const y = []
  const z = []

  for (let i = 0; i < size; i++) {
    const xi = -5 + (10 * i) / size
    x.push(xi)
    y.push(xi)
  }

  for (let i = 0; i < size; i++) {
    const row = []
    for (let j = 0; j < size; j++) {
      row.push(Math.sin(x[i]) * Math.cos(y[j]))
    }
    z.push(row)
  }

  return { x, y, z }
}

// Generate 3D scatter data (random points)
const generateScatterData = (count: number = 100) => {
  const x = []
  const y = []
  const z = []

  for (let i = 0; i < count; i++) {
    x.push(Math.random() * 10 - 5)
    y.push(Math.random() * 10 - 5)
    z.push(Math.random() * 2 - 1)
  }

  return { x, y, z }
}

// Theme-aware colors using CSS variables from PrimeVue theme
const chartColors = computed(() => {
  const dark = layoutStore.isDarkTheme

  // Read colors from active theme
  const background = getCSSVariable('--surface-0') || (dark ? '#1e293b' : '#ffffff')
  const textColor = getCSSVariable('--text-color') || (dark ? '#e2e8f0' : '#1f2937')
  const gridColor = getCSSVariable('--surface-border') || (dark ? '#334155' : '#e5e7eb')
  const primaryColor = getCSSVariable('--primary-color') || (dark ? '#10b981' : '#059669')

  // For surface gradient, use theme colors with variations
  // Parse primary color and create gradient (fallback to computed values)
  const surfaceColorscale = dark ? [
    [0, getCSSVariable('--blue-900') || '#1e3a8a'],
    [0.5, getCSSVariable('--purple-600') || '#7c3aed'],
    [1, getCSSVariable('--red-600') || '#dc2626']
  ] : [
    [0, getCSSVariable('--blue-100') || '#dbeafe'],
    [0.5, getCSSVariable('--purple-300') || '#a78bfa'],
    [1, getCSSVariable('--red-300') || '#fca5a5']
  ]

  // Scatter color uses primary or accent color
  const scatterColor = getCSSVariable('--yellow-400') || (dark ? '#fbbf24' : '#f59e0b')

  return {
    background,
    gridColor,
    textColor,
    surfaceColorscale,
    scatterColor,
    primaryColor
  }
})

const createPlot = () => {
  if (!plotContainer.value) return

  const surfaceData = generateSurfaceData()
  const scatterData = generateScatterData(80)

  const trace1 = {
    type: 'surface',
    x: surfaceData.x,
    y: surfaceData.y,
    z: surfaceData.z,
    colorscale: chartColors.value.surfaceColorscale,
    showscale: true,
    name: 'Surface',
    hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}<br>z: %{z:.2f}<extra></extra>',
    contours: {
      z: {
        show: true,
        usecolormap: true,
        highlightcolor: chartColors.value.gridColor,
        project: { z: true }
      }
    }
  }

  const trace2 = {
    type: 'scatter3d',
    mode: 'markers',
    x: scatterData.x,
    y: scatterData.y,
    z: scatterData.z,
    marker: {
      size: 4,
      color: chartColors.value.scatterColor,
      opacity: 0.8,
      line: {
        color: chartColors.value.textColor,
        width: 0.5
      }
    },
    name: 'Scatter Points',
    hovertemplate: 'Point<br>x: %{x:.2f}<br>y: %{y:.2f}<br>z: %{z:.2f}<extra></extra>'
  }

  const data = [trace1, trace2]

  const layout = {
    title: {
      text: props.title,
      font: {
        color: chartColors.value.textColor,
        size: 18
      }
    },
    autosize: true,
    height: props.height,
    paper_bgcolor: chartColors.value.background,
    plot_bgcolor: chartColors.value.background,
    scene: {
      xaxis: {
        title: 'X Axis',
        gridcolor: chartColors.value.gridColor,
        color: chartColors.value.textColor,
        backgroundcolor: chartColors.value.background
      },
      yaxis: {
        title: 'Y Axis',
        gridcolor: chartColors.value.gridColor,
        color: chartColors.value.textColor,
        backgroundcolor: chartColors.value.background
      },
      zaxis: {
        title: 'Z = sin(x) * cos(y)',
        gridcolor: chartColors.value.gridColor,
        color: chartColors.value.textColor,
        backgroundcolor: chartColors.value.background
      },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.3 },
        center: { x: 0, y: 0, z: 0 }
      }
    },
    showlegend: true,
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: chartColors.value.background,
      bordercolor: chartColors.value.gridColor,
      borderwidth: 1,
      font: {
        color: chartColors.value.textColor
      }
    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 40
    }
  }

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['toImage'],
    modeBarButtonsToAdd: [
      {
        name: 'Reset Camera',
        icon: Plotly.Icons.home,
        click: () => {
          if (plotContainer.value) {
            Plotly.relayout(plotContainer.value, {
              'scene.camera.eye': { x: 1.5, y: 1.5, z: 1.3 },
              'scene.camera.center': { x: 0, y: 0, z: 0 }
            })
          }
        }
      }
    ]
  }

  Plotly.newPlot(plotContainer.value, data, layout, config)

  // Set up resize observer for responsive charts
  if (!props.width) {
    resizeObserver.value = new ResizeObserver(() => {
      if (plotContainer.value) {
        Plotly.Plots.resize(plotContainer.value)
      }
    })
    resizeObserver.value.observe(plotContainer.value)
  }
}

const updatePlotTheme = () => {
  if (!plotContainer.value) return

  const layout = {
    paper_bgcolor: chartColors.value.background,
    plot_bgcolor: chartColors.value.background,
    'title.font.color': chartColors.value.textColor,
    'scene.xaxis.gridcolor': chartColors.value.gridColor,
    'scene.xaxis.color': chartColors.value.textColor,
    'scene.xaxis.backgroundcolor': chartColors.value.background,
    'scene.yaxis.gridcolor': chartColors.value.gridColor,
    'scene.yaxis.color': chartColors.value.textColor,
    'scene.yaxis.backgroundcolor': chartColors.value.background,
    'scene.zaxis.gridcolor': chartColors.value.gridColor,
    'scene.zaxis.color': chartColors.value.textColor,
    'scene.zaxis.backgroundcolor': chartColors.value.background,
    'legend.bgcolor': chartColors.value.background,
    'legend.bordercolor': chartColors.value.gridColor,
    'legend.font.color': chartColors.value.textColor
  }

  const dataUpdate = {
    'colorscale': [chartColors.value.surfaceColorscale]
  }

  Plotly.restyle(plotContainer.value, dataUpdate, [0])
  Plotly.relayout(plotContainer.value, layout)
}

// Watch for theme changes
watch(() => layoutStore.isDarkTheme, () => {
  updatePlotTheme()
})

// Watch for size changes
watch(() => [props.width, props.height], () => {
  if (plotContainer.value) {
    Plotly.relayout(plotContainer.value, {
      height: props.height
    })
  }
})

onMounted(() => {
  createPlot()
})

onUnmounted(() => {
  if (plotContainer.value) {
    Plotly.purge(plotContainer.value)
  }

  if (resizeObserver.value && plotContainer.value) {
    resizeObserver.value.unobserve(plotContainer.value)
    resizeObserver.value = null
  }
})

// Expose methods for external control
defineExpose({
  regenerateData: () => {
    createPlot()
  },
  resetCamera: () => {
    if (plotContainer.value) {
      Plotly.relayout(plotContainer.value, {
        'scene.camera.eye': { x: 1.5, y: 1.5, z: 1.3 },
        'scene.camera.center': { x: 0, y: 0, z: 0 }
      })
    }
  }
})
</script>

<template>
  <div class="plotly-chart-component">
    <div
      ref="plotContainer"
      class="plotly-container"
      :style="{ width: width ? width + 'px' : '100%', height: height + 'px' }"
    ></div>
  </div>
</template>

<style scoped>
.plotly-chart-component {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.plotly-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}
</style>
