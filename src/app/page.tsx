import NetworkDashboard from './components/NetworkDashboard'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto py-6">
        <h1 className="text-4xl font-bold mb-8">SAKIN SIEM</h1>
        <NetworkDashboard />
      </div>
    </main>
  )
}

export const revalidate = 3;
