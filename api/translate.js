export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Must be a post request' });
    }

    const { text, target } = req.body;

    if (!text || !target) {
        return res.status(400).json({ error: 'No texts or language' });
    }

    const apiKey = process.env.key;
    const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const config = {
        method: "POST",
        headers: {
            accept: 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            q: text,
            target: target,
            format: 'text'
        })
    };

    try {
        const response = await fetch(apiUrl, config);

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({error: errorText});
        }

        const data = await response.json();
        return res.status(200).json(data);
    } 
    catch (error) {
        console.error('Error in API call', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}






