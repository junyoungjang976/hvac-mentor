import './index.css'
import { useDeviceType } from './hooks/useDeviceType'
import DeviceSelector from './layouts/DeviceSelector'
import PhoneLayout from './layouts/PhoneLayout'
import TabletLayout from './layouts/TabletLayout'

function App() {
  const { deviceType, setDevice, clearDevice } = useDeviceType()

  // Show device selector if no device type is set
  if (!deviceType) {
    return <DeviceSelector onSelect={setDevice} />
  }

  // Show appropriate layout based on device type
  if (deviceType === 'phone') {
    return <PhoneLayout onDeviceChange={clearDevice} />
  }

  return <TabletLayout onDeviceChange={clearDevice} />
}

export default App
