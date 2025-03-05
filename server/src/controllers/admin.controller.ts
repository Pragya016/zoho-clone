import { Request, Response } from 'express';
import fs from 'fs';
import csv from 'csv-parser';

export async function handleFileUpload(req: Request, res: Response) {
    try {
        const file = req.file;
        console.log(file);
        if (!file) {
            return res.status(400).send({ message: 'No file uploaded' });
        }

        const results: object[] = [];
        fs.createReadStream(file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                // TODO: Save the data in the database
                res.status(201).send(results);
            })
            .on('error', (err) => {
                res.status(500).send({ message: 'Error processing file' });
            });
    } catch (e) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
}
