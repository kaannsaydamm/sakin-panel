'use client'

import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface EventData {
  eventType: string
  _count: { id: number }
}

export default function EventChart() {
  const [eventData, setEventData] = useState<EventData[]>([])

  useEffect(() => {
    fetch('/api/events')
      .then(response => response.json())
      .then(data => setEventData(data))
      .catch(error => console.error('Error fetching event data:', error))
  }, [])

  const chartData = {
    labels: eventData.map(event => event.eventType),
    datasets: [
      {
        label: 'Number of Events',
        data: eventData.map(event => event._count.id),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Security Events (Last 7 Days)',
      },
    },
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Bar options={options} data={chartData} />
    </div>
  )
}

