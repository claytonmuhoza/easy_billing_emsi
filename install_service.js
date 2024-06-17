const Service = require('node-windows').Service

// Service configuration
const svc = new Service({
   name: 'Easybilling service system', // Replace with your service name
   description: 'le service de easy billing', // Replace with a description
   script: 'C:\\wamp64\\www\\egeosoft\\easy_billing\\server.js', // Replace with the path to your server.js
})

// Install the service
svc.on('install', function () {
   console.log('Service installed!')
})

svc.install()
