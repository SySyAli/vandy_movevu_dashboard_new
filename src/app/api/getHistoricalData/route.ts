/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createReadStream } from 'fs';
import path from 'path';
import csv from 'csv-parser';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public/data/historical/historical_data.csv');

  try {
    // Create a readable stream for the CSV file
    const csvStream = createReadStream(filePath);

    const monthYearCounts: Record<string, number> = {};

    return new Promise((resolve, reject) => {
      csvStream
        .pipe(csv())
        .on('data', (row) => {
          const monthYear = row.MONTH_YEAR;
          const cardIdStatus = row.CARD_ID_STATUS;

          // Only count entries where CARD_ID_STATUS is not 'UNKNOWN'
          if (cardIdStatus !== 'UNKNOWN') {
            // Increment the count for each valid month-year entry
            monthYearCounts[monthYear] = (monthYearCounts[monthYear] || 0) + 1;
          }
        })
        .on('end', () => {
          // Sort the keys (month-year) in chronological order before returning the result
          const sortedMonthYearCounts = Object.keys(monthYearCounts)
            .sort((a, b) => {
              const dateA = new Date(`${a}-01`); // Convert 'YYYY-MM' to Date
              const dateB = new Date(`${b}-01`);
              return dateA.getTime() - dateB.getTime(); // Sort by time
            })
            .reduce((acc: Record<string, number>, key) => {
              acc[key] = monthYearCounts[key];
              return acc;
            }, {});

          // Return the sorted data
          resolve(NextResponse.json(sortedMonthYearCounts));
        })
        .on('error', (error) => {
          console.error('Error reading CSV file:', error);
          reject(NextResponse.error());
        });
    });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return NextResponse.error();
  }
}
