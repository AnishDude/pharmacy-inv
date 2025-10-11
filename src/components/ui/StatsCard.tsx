import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  name: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: LucideIcon
}

export function StatsCard({ name, value, change, changeType, icon: Icon }: StatsCardProps) {
  return (
    <div className="card">
      <div className="card-content">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-md bg-primary-100 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-500">{name}</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              <p className={`ml-2 text-sm ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
