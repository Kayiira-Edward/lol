// src/lib/firebase/auth/config.ts
import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  connectAuthEmulator,
  setPersistence,
  browserLocalPersistence,
  inMemoryPersistence 
} from 'firebase/auth'

const auth = getAuth(app)

// Configure persistence
setPersistence(auth, browserLocalPersistence)

// Emulator connection (development)
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099')
}

export { auth }