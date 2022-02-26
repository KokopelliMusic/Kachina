import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'nl.kokopellimusic.kachina',
  appName: 'Kokopelli',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      backgroundColor: '#EAEAEA',
      showSpinner: false      
    }
  }
}

export default config
