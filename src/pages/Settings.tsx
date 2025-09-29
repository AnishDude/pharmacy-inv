import { useState } from 'react'
import { Save, Bell, Shield, Database, Palette } from 'lucide-react'

export function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      lowStock: true,
      expiryAlerts: true,
      orderReminders: false,
      salesReports: true,
    },
    inventory: {
      autoReorder: false,
      minStockThreshold: 10,
      expiryWarningDays: 30,
    },
    general: {
      pharmacyName: 'Live Pharmacy',
      timezone: 'America/New_York',
      currency: 'USD',
      theme: 'light',
    },
  })

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-700">
          Configure your pharmacy management system preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* Notifications */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            </div>
          </div>
          <div className="card-content space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Low Stock Alerts</h4>
                <p className="text-sm text-gray-500">Get notified when inventory runs low</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.lowStock}
                  onChange={(e) => handleSettingChange('notifications', 'lowStock', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Expiry Alerts</h4>
                <p className="text-sm text-gray-500">Get notified before products expire</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.expiryAlerts}
                  onChange={(e) => handleSettingChange('notifications', 'expiryAlerts', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Order Reminders</h4>
                <p className="text-sm text-gray-500">Get reminded to place regular orders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.orderReminders}
                  onChange={(e) => handleSettingChange('notifications', 'orderReminders', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Inventory Settings */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-medium text-gray-900">Inventory Management</h3>
            </div>
          </div>
          <div className="card-content space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Stock Threshold
              </label>
              <input
                type="number"
                className="input w-32"
                value={settings.inventory.minStockThreshold}
                onChange={(e) => handleSettingChange('inventory', 'minStockThreshold', parseInt(e.target.value))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Warning (Days)
              </label>
              <input
                type="number"
                className="input w-32"
                value={settings.inventory.expiryWarningDays}
                onChange={(e) => handleSettingChange('inventory', 'expiryWarningDays', parseInt(e.target.value))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Auto Reorder</h4>
                <p className="text-sm text-gray-500">Automatically generate reorder suggestions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.inventory.autoReorder}
                  onChange={(e) => handleSettingChange('inventory', 'autoReorder', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-medium text-gray-900">General</h3>
            </div>
          </div>
          <div className="card-content space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pharmacy Name
              </label>
              <input
                type="text"
                className="input w-full max-w-md"
                value={settings.general.pharmacyName}
                onChange={(e) => handleSettingChange('general', 'pharmacyName', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  className="input w-full"
                  value={settings.general.timezone}
                  onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  className="input w-full"
                  value={settings.general.currency}
                  onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="btn btn-primary btn-lg" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
