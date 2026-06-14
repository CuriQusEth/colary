fetch('http://localhost:3000/api/mcp', { method: 'OPTIONS' }).then(r => console.log(r.status)).catch(console.error)
