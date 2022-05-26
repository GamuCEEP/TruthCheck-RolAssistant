self.addEventListener('fetch', handleRequest)
self.onerror = (e) => {
  console.error('Error -->', e)
}

self.addEventListener('install', () => {
  console.log('Instalado')
})

self.addEventListener('activate', () => {
  console.log('Activo')
})