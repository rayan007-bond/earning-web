const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));
const server = app.listen(5001, () => {
    const fetch = require('node-fetch');
    fetch('http://localhost:5001/api/admin/users/12345', { method: 'DELETE' })
        .then(r => r.json())
        .then(d => { console.log(d); server.close(); })
        .catch(e => { console.error(e); server.close(); });
});
