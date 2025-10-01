// gantt-chart.component.ts
import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
} from '@angular/core';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);
Chart.register(annotationPlugin);

interface GanttData {
  task: string;
  start: string;
  end: string;
}

interface GanttConfig {
  title?: string;
  barColor?: string;
  borderRadius?: number;
  dateFormat?: string;
  tooltipCallback?: (context: any, data: GanttData[]) => string;
}

@Component({
  selector: 'app-gantt-chart',
  standalone: true,
  template: `
    <div style="position: relative; height: 400px; width: 100%;">
      <canvas #ganttCanvas></canvas>
    </div>
  `,
})
export class GanttChartComponent implements AfterViewInit {
  @ViewChild('ganttCanvas') ganttCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() data: GanttData[] = [];
  @Input() config: GanttConfig = {};
  chart!: Chart;

  ngAfterViewInit(): void {
    if (!this.data || this.data.length === 0) {
      console.warn('No data provided for Gantt chart');
      return;
    }

    const startDate = new Date(
      Math.min(...this.data.map((d) => new Date(d.start).getTime()))
    );
    const offsetData = this.data.map(
      (d) =>
        (new Date(d.start).getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const durationData = this.data.map(
      (d) =>
        (new Date(d.end).getTime() - new Date(d.start).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const labels = this.data.map((d) => d.task);

    const ctx = this.ganttCanvas.nativeElement.getContext('2d')!;
    const dateFormat = this.config.dateFormat || 'en-GB';

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Offset',
            data: offsetData,
            backgroundColor: 'rgba(0,0,0,0)',
            stack: 'stack1',
          },
          {
            label: 'Duration',
            data: durationData,
            backgroundColor: this.config.barColor || '#ec407a',
            borderRadius: this.config.borderRadius || 6,
            stack: 'stack1',
            barThickness: 25,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        elements: {
          bar: {
            borderSkipped: false,
          },
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuad',
        },
        plugins: {
          legend: { display: false },
          title: {
            display: !!this.config.title,
            text: this.config.title,
            color: 'white',
            font: {
              size: 16,
              weight: 'bold',
            },
            align: 'start',
            padding: {
              bottom: 20,
            },
          },
          tooltip: {
            enabled: true,
            position: 'nearest',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            titleFont: { size: 14 },
            bodyFont: { size: 12 },
            padding: 12,
            cornerRadius: 8,
            borderColor: this.config.barColor || '#ec407a',
            borderWidth: 3,
            caretPadding: 10,
            callbacks: {
              title: (tooltipItems) =>
                this.data[tooltipItems[0].dataIndex].task,
              label: (tooltipItem) => {
                const task = this.data[tooltipItem.dataIndex];
                const startDate = new Date(task.start).toLocaleDateString(
                  dateFormat,
                  {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }
                );
                const endDate = new Date(task.end).toLocaleDateString(
                  dateFormat,
                  {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }
                );
                return [`Start: ${startDate}`, `End: ${endDate}`];
              },
            },
          },
          datalabels: {
            display: true,
            color: 'white',
            align: 'center',
            anchor: 'center',
            font: {
              family: 'sans-serif',
              size: 12,
              weight: 'normal',
            },
            formatter: (value, context) => {
              if (context.dataset.label !== 'Duration') {
                return '';
              }

              const dataIndex = context.dataIndex;
              const chart = context.chart;
              const ctx = chart.ctx;
              const datasets = chart.data.datasets as {
                data: number[];
              }[];
              const offset = datasets[0].data[dataIndex] as number;
              const duration = datasets[1].data[dataIndex] as number;
              const startPixel = chart.scales['x'].getPixelForValue(offset);
              const endPixel = chart.scales['x'].getPixelForValue(offset + duration);

              if (endPixel <= startPixel) {
                return '';
              }

              const labels = chart.data.labels as string[];
              let label = labels[dataIndex] as string;

              const font = 'normal 12px sans-serif';
              ctx.save();
              ctx.font = font;
              let textWidth = ctx.measureText(label).width;
              ctx.restore();

              const padding = 20;
              const availableWidth = endPixel - startPixel - padding;

              if (availableWidth < 20) {
                return '';
              }

              if (textWidth > availableWidth) {
                let truncated = label;
                while (textWidth > availableWidth && truncated.length > 0) {
                  truncated = truncated.slice(0, -1);
                  ctx.save();
                  ctx.font = font;
                  textWidth = ctx.measureText(truncated + '...').width;
                  ctx.restore();
                }
                if (truncated.length === 0) {
                  return '';
                }
                return truncated + '...';
              }

              return label;
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: '#979797ff',
              callback: function (this, tickValue: string | number): string {
                if (typeof tickValue === 'number') {
                  const date = new Date(
                    startDate.getTime() + tickValue * 24 * 60 * 60 * 1000
                  );
                  return date.toLocaleDateString(dateFormat);
                }
                return tickValue.toString();
              },
            },
            grid: {
              color: '#8b8b8bff',
            },
          },
          y: {
            stacked: true,
            ticks: {
              display: false,
            },
            grid: {
              drawTicks: false,
              display: false,
            },
          },
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
          },
        },
      },
    });
  }

  private customTooltip(context: any, dateFormat: string): void {
    const { chart, tooltip } = context;

    // Get or create tooltip element
    let tooltipEl = chart.canvas.parentNode.querySelector('div.custom-tooltip');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'custom-tooltip';
      tooltipEl.style.background = 'rgba(0, 0, 0, 0.9)';
      tooltipEl.style.borderRadius = '8px';
      tooltipEl.style.color = 'white';
      tooltipEl.style.opacity = '0';
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transition = 'all .1s ease';
      tooltipEl.style.padding = '12px 16px';
      tooltipEl.style.fontSize = '13px';
      tooltipEl.style.fontFamily =
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      tooltipEl.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
      tooltipEl.style.zIndex = '1000';
      tooltipEl.style.borderLeft = `3px solid ${
        this.config.barColor || '#ec407a'
      }`;
      tooltipEl.style.minWidth = '160px';
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = '0';
      return;
    }

    // Set content
    if (tooltip.body) {
      const dataIndex = tooltip.dataPoints[0].dataIndex;
      const task = this.data[dataIndex];

      // Format dates
      const startDate = new Date(task.start);
      const endDate = new Date(task.end);
      const formatOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };

      const formattedStart = startDate.toLocaleDateString(
        dateFormat,
        formatOptions
      );
      const formattedEnd = endDate.toLocaleDateString(
        dateFormat,
        formatOptions
      );

      // Use custom tooltip callback if provided
      if (this.config.tooltipCallback) {
        const customContent = this.config.tooltipCallback(
          tooltip.dataPoints[0],
          this.data
        );
        tooltipEl.innerHTML = `<div style="text-align: left;">${customContent}</div>`;
      } else {
        // Default tooltip content
        tooltipEl.innerHTML = `
        <div style="text-align: left;">
          <div style="font-weight: 600; margin-bottom: 8px; font-size: 14px; line-height: 1.2;">
            ${task.task}
          </div>
          <div style="font-size: 12px; color: rgba(255, 255, 255, 0.8); line-height: 1.3;">
            <div style="margin-bottom: 2px;">Start: ${formattedStart}</div>
            <div>End: ${formattedEnd}</div>
          </div>
        </div>
      `;
      }
    }

    // Position tooltip
    const canvasPosition = chart.canvas.getBoundingClientRect();
    const tooltipWidth = tooltipEl.offsetWidth || 160; // Use minWidth if offsetWidth is not yet available
    const chartArea = chart.chartArea; // Get chart area for accurate bar positioning

    // Calculate left position (centered above the bar)
    let left = canvasPosition.left + tooltip.caretX - tooltipWidth / 2;

    // Ensure tooltip doesn't go off screen horizontally
    if (left + tooltipWidth > window.innerWidth) {
      left = window.innerWidth - tooltipWidth - 10;
    } else if (left < 0) {
      left = 10;
    }

    // Calculate top position to place tooltip above the bar
    const dataIndex = tooltip.dataPoints[0].dataIndex;
    const barHeight =
      chart.scales.y.getPixelForValue(dataIndex) -
      chart.scales.y.getPixelForValue(dataIndex - 10); // Approximate bar height
    const barTop = chart.scales.y.getPixelForValue(dataIndex) - barHeight / 2; // Center of the bar
    const top =
      canvasPosition.top + chartArea.top + barTop - tooltipEl.offsetHeight - 10;

    // Apply positioning
    tooltipEl.style.opacity = '1';
    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.transform = 'none'; // Remove transform to avoid additional offsets
  }
}