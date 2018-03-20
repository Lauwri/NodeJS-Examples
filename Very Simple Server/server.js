const http = require('http');
const host = '0.0.0.0';
const port = 3000;
const url = require('url');
const xss = require('xss-filters');
const fs = require('fs');

const server = http.createServer((req, res) => {
    var urlParts = url.parse(req.url, true);
    var query = urlParts.query;

    if (urlParts.pathname == "/save" && req.method == "GET") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.write('Save the GET request to a file\n');

        if (query.data) {
            const file = fs.createWriteStream('./temp_query');
            file.write(query.data);
            file.end();
        } else {
            res.write("no data to write :(");
        }

        res.end();

    } else if (urlParts.pathname == "/save" && req.method == "POST") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.write('Save the POST request to a file\n');

        req.on('data', (data) => {
            if (data) {
                const file = fs.createWriteStream('./temp_query');
                file.write(data);
                file.end();
            } else {
                res.write("no data to write :(");
            }
        });
        res.end();
    }  else if (urlParts.pathname == "/print" && req.method == "GET") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.write('Print the file content\n');

        fs.readFile('./temp_query', (err, data) => {
            res.write(xss.inHTMLData(data.toString()));
            res.end();
        });
        
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.write("404 error :(");
        res.end();
    }
}).listen(port, host, () => {
});
