import fs from 'fs';
export default function handler(req, res) {
  const root = fs.readFileSync('./public/merkleRoot.txt', 'utf8').trim();
  res.status(200).json({ merkleRoot: root });
}
