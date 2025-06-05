// @ts-nocheck
import Papa from 'papaparse';
import { readFile } from 'fs/promises';
import path from 'path';

/**
 * Read and parse a CSV or JSON file from the server's file system. Must be run server-side
 * only, e.g. in a page.server.js file.
 * @param {string} fileName - The name of a file in the src//lib/data directory
 * @returns {Promise<Array|Object>} - Parsed data as an array (CSV) or object (JSON).
 */

export async function readDataset(fileName) {
    try {
        // Ensure fileName is provided
        if (!fileName) throw new Error('Missing file path');

        const fullfileName = path.resolve('src/lib/data/' + fileName);
        const data = await readFile(fullfileName, 'utf8');

        const fileExt = fileName.split('.').pop().toLowerCase();

        if (fileExt === 'json') {
            return JSON.parse(data);
        } else if (fileExt === 'csv') {
            const parsedData = Papa.parse(data, {
                header: true, // Uses first row as column names
                skipEmptyLines: true,
                dynamicTyping: true // Convert numbers automatically
            });
            return parsedData.data;
        } else {
            throw new Error(`Unsupported file type: ${fileExt}`);
        }
    } catch (error) {
        console.error(`Error reading dataset: ${error.message}`);
        return []; // Return an empty array to avoid breaking the UI
    }
}
