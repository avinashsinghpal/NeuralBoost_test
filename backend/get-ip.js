// Helper script to get the local IP address
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({
          name: name,
          address: iface.address
        });
      }
    }
  }
  
  return addresses;
}

const ips = getLocalIP();
console.log('\n=== Available Network Interfaces ===');
if (ips.length === 0) {
  console.log('No network interfaces found. Make sure you are connected to a network.');
} else {
  ips.forEach((ip, idx) => {
    console.log(`${idx + 1}. ${ip.name}: ${ip.address}`);
  });
  console.log('\n=== To access from other devices ===');
  console.log(`Use: http://${ips[0].address}:5001`);
  console.log(`Or set TRACE_PUBLIC_URL=http://${ips[0].address}:5001 in your .env file\n`);
}

