

// /api/hello.js
module.exports = (req, res) => {
    res.status(200).send('Hello, world!');

    //know only working wit post methods
    if (!req.method === 'POST') {
        return {
            statusCode: 405,
            body: 'This only accepts POST requests',
        }
    }
  };