const fetch = require('node-fetch');

async function test() {
    try {
        const response = await fetch('http://localhost:5000/api/admin/users/123456', {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer fake-token'
            }
        });
        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Response:', text);
    } catch (e) {
        console.error(e);
    }
}
test();
