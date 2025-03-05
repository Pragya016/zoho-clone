import {Request, Response} from 'express';

export async function handleFileUpload(req: Request, res: Response) {
    res.send('File uploaded');
}