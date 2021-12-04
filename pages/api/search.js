import { search } from 'lib/notion';

export default async function handler(req, res) {
    const { q } = req.query;

    if (!q) {
        res.status(400).end('Bad Request. Missing Query.');
        return;
    }

    const result = await search(q);
    res.status(200).json(result);

}