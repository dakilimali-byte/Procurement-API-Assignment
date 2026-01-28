
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const dataFile = path.join(__dirname, 'data.json');


const server = http.createServer((req, res) => {

    if (req.url === '/kgl/procurement' && req.method === 'GET') {
        try {

            const fileData = fs.readFileSync(dataFile, 'utf8');
            const records = fileData ? JSON.parse(fileData) : [];


            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(records));

        } catch (error) {

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Server error while reading data' }));
        }
    }

    else if (req.url === '/kgl/procurement' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const newRecord = JSON.parse(body);


                const fileData = fs.readFileSync(dataFile, 'utf8');
                const records = fileData ? JSON.parse(fileData) : [];

                newRecord.id = Date.now();
                newRecord.createdAt = new Date();


                records.push(newRecord);
                fs.writeFileSync(dataFile, JSON.stringify(records, null, 2));

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Produce procurement recorded successfully'
                }));

            } catch (error) {

                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON format' }));
            }
        });
    }


    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});


server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error('Port 3000 is already in use');
    } else {
        console.error('Server error:', error);
    }
});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
