import React, { useState } from 'react'
import { Stone } from './Stone'

export interface KPIDataPoint {
  date: string
  value: number
  milestoneTitle?: string
  milestoneStageNumber?: number
}

interface KPIChartProps {
  title: string
  unit: string
  baseline: number
  target: number
  dataPoints: KPIDataPoint[]
}

export const KPIChart: React.FC<KPIChartProps> = ({
  title,
  unit,
  baseline,
  target,
  dataPoints,
}) => {
  const [viewTable, setViewTable] = useState(false)

  if (dataPoints.length === 0) {
    return (
      <div className="p-4 border border-[var(--line)] rounded-[var(--radius-md)] bg-[var(--surface)] text-[var(--ink-3)] text-sm">
        No KPI readings recorded yet.
      </div>
    )
  }

  // Calculate y bounds
  const allVals = [baseline, target, ...dataPoints.map((d) => d.value)]
  const minVal = Math.min(...allVals) * 0.9
  const maxVal = Math.max(...allVals) * 1.1
  const range = maxVal - minVal || 1

  const width = 600
  const height = 220
  const paddingLeft = 40
  const paddingRight = 100
  const paddingTop = 20
  const paddingBottom = 40

  const chartW = width - paddingLeft - paddingRight
  const chartH = height - paddingTop - paddingBottom

  const getY = (val: number) => {
    return paddingTop + chartH - ((val - minVal) / range) * chartH
  }

  const getX = (index: number) => {
    if (dataPoints.length === 1) return paddingLeft + chartW / 2
    return paddingLeft + (index / (dataPoints.length - 1)) * chartW
  }

  // Generate SVG polyline path for actual values
  const polylinePoints = dataPoints
    .map((d, i) => `${getX(i)},${getY(d.value)}`)
    .join(' ')

  const latestVal = dataPoints[dataPoints.length - 1].value

  return (
    <div className="border border-[var(--line)] rounded-[var(--radius-md)] bg-[var(--surface)] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-heading font-semibold text-base text-[var(--ink)]">{title}</h4>
          <p className="text-xs text-[var(--ink-2)]">
            Baseline {baseline} {unit} → Target {target} {unit} (Current: {latestVal} {unit})
          </p>
        </div>
        <button
          onClick={() => setViewTable(!viewTable)}
          className="px-3 py-1 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--sunken)] cursor-pointer"
        >
          {viewTable ? 'View as chart' : 'View as table'}
        </button>
      </div>

      {!viewTable ? (
        <div className="relative overflow-x-auto">
          <svg width={width} height={height} className="overflow-visible">
            {/* Baseline dashed line */}
            <line
              x1={paddingLeft}
              y1={getY(baseline)}
              x2={paddingLeft + chartW}
              y2={getY(baseline)}
              stroke="var(--ink-3)"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <text
              x={paddingLeft + chartW + 8}
              y={getY(baseline) + 4}
              fill="var(--ink-3)"
              fontSize="11"
              fontWeight="600"
            >
              Baseline ({baseline})
            </text>

            {/* Target dashed line */}
            <line
              x1={paddingLeft}
              y1={getY(target)}
              x2={paddingLeft + chartW}
              y2={getY(target)}
              stroke="var(--go)"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <text
              x={paddingLeft + chartW + 8}
              y={getY(target) + 4}
              fill="var(--go)"
              fontSize="11"
              fontWeight="600"
            >
              Target ({target})
            </text>

            {/* Actual line */}
            <polyline
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              points={polylinePoints}
            />
            <text
              x={paddingLeft + chartW + 8}
              y={getY(latestVal) + 4}
              fill="var(--primary)"
              fontSize="12"
              fontWeight="700"
            >
              Actual ({latestVal})
            </text>

            {/* Data points & milestone stones */}
            {dataPoints.map((d, i) => {
              const cx = getX(i)
              const cy = getY(d.value)
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="4" fill="var(--primary)" />
                  {/* Date on X axis */}
                  <text
                    x={cx}
                    y={height - 10}
                    textAnchor="middle"
                    fill="var(--ink-2)"
                    fontSize="10"
                  >
                    {d.date}
                  </text>
                  {/* Milestone marker */}
                  {d.milestoneStageNumber && (
                    <foreignObject x={cx - 10} y={cy - 28} width="20" height="24">
                      <Stone stageNumber={d.milestoneStageNumber} size={20} status="done" />
                    </foreignObject>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
      ) : (
        /* Accessible Table View */
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[var(--sunken)] border-b border-[var(--line)] text-[var(--ink-2)] font-heading">
                <th className="p-2">Date</th>
                <th className="p-2">Actual ({unit})</th>
                <th className="p-2">Target</th>
                <th className="p-2">Baseline</th>
                <th className="p-2">Milestone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {dataPoints.map((d, i) => (
                <tr key={i}>
                  <td className="p-2 font-medium">{d.date}</td>
                  <td className="p-2 font-bold text-[var(--primary)]">{d.value}</td>
                  <td className="p-2 text-[var(--go)]">{target}</td>
                  <td className="p-2 text-[var(--ink-3)]">{baseline}</td>
                  <td className="p-2">{d.milestoneTitle ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
