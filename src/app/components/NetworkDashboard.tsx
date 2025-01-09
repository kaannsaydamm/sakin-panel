'use client'

import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { groupDataByHour } from '@/utils/formatData'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function NetworkDashboard() {
  const [data, setData] = useState<any>({ packetData: [], sniData: [] })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/network-data')
        const result = await response.json()
        setData(result)
        setMessage(result.message || null)
      } catch (error) {
        console.error('Error fetching data:', error)
        setMessage('Error fetching data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const packetChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Packet Count',
        data: groupDataByHour(data.packetData).map(d => d.count),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      }
    ]
  }

  const sniChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'SNI Count',
        data: groupDataByHour(data.sniData).map(d => d.count),
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 p-4">
      {message && (
        <Alert className="md:col-span-2">
          <AlertTitle>Notice</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Network Packet Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={packetChartData} options={chartOptions} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SNI Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={sniChartData} options={chartOptions} />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent SNI Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">SNI</th>
                  <th className="px-4 py-2">Source IP</th>
                  <th className="px-4 py-2">Destination IP</th>
                </tr>
              </thead>
              <tbody>
                {data.sniData.slice(0, 10).map((entry: any) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-2">{new Date(entry.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2">{entry.sni}</td>
                    <td className="px-4 py-2">{entry.srcIp}</td>
                    <td className="px-4 py-2">{entry.dstIp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

