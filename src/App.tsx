import { useState } from 'react'
import './index.css'
import { useDeviceType } from './hooks/useDeviceType'
import DeviceSelector from './layouts/DeviceSelector'
import PhoneLayout from './layouts/PhoneLayout'
import TabletLayout from './layouts/TabletLayout'
import CustomerDiagnosis from './components/customer/CustomerDiagnosis'

type AppMode = 'engineer' | 'customer'

function App() {
  const { deviceType, setDevice, clearDevice } = useDeviceType()
  const [mode, setMode] = useState<AppMode>('engineer')

  // Show device selector if no device type is set
  if (!deviceType) {
    return <DeviceSelector onSelect={setDevice} />
  }

  // Customer mode - simple self-diagnosis wizard
  if (mode === 'customer') {
    return (
      <CustomerDiagnosis
        onComplete={(data) => {
          console.log('Customer diagnosis completed:', data)
          // TODO: Save to Supabase
        }}
        onSwitchToEngineer={() => setMode('engineer')}
      />
    )
  }

  // Engineer mode - full app with device layouts
  if (deviceType === 'phone') {
    return (
      <PhoneLayout
        onDeviceChange={clearDevice}
        onSwitchToCustomer={() => setMode('customer')}
      />
    )
  }

  return (
    <TabletLayout
      onDeviceChange={clearDevice}
      onSwitchToCustomer={() => setMode('customer')}
    />
  )
}

export default App
