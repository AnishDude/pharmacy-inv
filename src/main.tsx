import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import { AuthGuard } from './components/auth/AuthGuard'
import { CustomerAuthGuard } from './components/auth/CustomerAuthGuard'
import './index.css'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_error: any) {
    return { hasError: true }
  }

  componentDidCatch(_error: any, errorInfo: any) {
    console.error('Error caught by boundary:', _error, errorInfo)
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return (this.props as any).children
  }
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading LIPMS...</p>
    </div>
  </div>
)

// Development tools
const DevTools = () => {
  if (import.meta.env.MODE === 'development') {
    return (
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs">
        <div>LIPMS Dev Mode</div>
        <div>React {React.version}</div>
      </div>
    )
  }
  return null
}

// Performance monitoring
const PerformanceMonitor = () => {
  React.useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'measure') {
            console.log(`Performance: ${entry.name} took ${entry.duration}ms`)
          }
        })
      })
      observer.observe({ entryTypes: ['measure'] })
      
      return () => observer.disconnect()
    }
  }, [])
  
  return null
}

// Theme provider wrapper
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = React.useState('light')
  
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('lipms-theme')
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  return (
    <div className={theme} data-theme={theme}>
      {children}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthGuard>
              <CustomerAuthGuard>
                <PerformanceMonitor />
                <React.Suspense fallback={<LoadingSpinner />}>
                  <App />
                </React.Suspense>
                <DevTools />
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />
              </CustomerAuthGuard>
            </AuthGuard>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
