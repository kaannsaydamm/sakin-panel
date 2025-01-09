export function groupDataByHour(data: any[]) {
    const grouped = data.reduce((acc, curr) => {
      const hour = new Date(curr.timestamp).getHours()
      if (!acc[hour]) {
        acc[hour] = 0
      }
      acc[hour]++
      return acc
    }, {})
  
    return Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: grouped[i] || 0
    }))
  }
  
  export function formatIPAddress(ip: string) {
    return ip.padStart(15, ' ')
  }
  
  