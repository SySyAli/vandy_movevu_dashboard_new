# Vanderbilt MoveVU Ridership Dashboard

<p align='center'>
  <img src='https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white'>
  <img src='https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white'>
  <img src='https://img.shields.io/badge/Prisma-green?style=for-the-badge&logo=prisma&logoColor=white'>
  <img src='https://img.shields.io/badge/Chart.js-orange?style=for-the-badge&logo=chart.js&logoColor=white'>
  <img src='https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white'>
</p>

## Overview
The Vanderbilt MoveVU Ridership Dashboard is a web application designed to visualize Nashville's bus ridership data, providing insights into usage trends across various routes. With a modern and interactive UI, the dashboard enables users to explore ridership data filtered by time periods and rider demographics.

<!-- ## Preview
![Dashboard Preview](assets/vanderbilt_ridership_dashboard.png) -->

## Key Features

- **Interactive Data Filtering**: Filter ridership data by custom date ranges and dynamically switch between different visualization tabs.
- **Top Routes Visualization**: View ridership trends for the top routes over time.
- **Unique Users Analysis**: Visualize monthly unique user counts for both historical and QuickTicket ridership.

## How It Works
The dashboard is built using a combination of technologies:

- **Next.js** for the frontend and server-side rendering.
- **TypeScript** for type safety and enhanced development experience.
- **Prisma ORM** to handle database access and manipulate PostgreSQL data.
- **Chart.js** for creating interactive and visually appealing data visualizations.
- **PostgreSQL** for creating interactive and visually appealing data visualizations.

## Installation
To set up and run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SySyAli/vandy_movevu_dashboard_new.git
2. **Navigate to the project directory:**
    ```bash
    cd vanderbilt_movevu
3. **Install dependencies:**
    ```bash
    npm install
4. Set up the database:
    - Ensure PostgreSQL is running locally or through a cloud service.
    - Update the Prisma `.env` file with your database connection string.
5. **Run Prisma migrations:**
    ```bash
    npx prisma migrate dev
6. **Start the development server:**
    ```bash
    npm run dev
The app will be running on `http://localhost:3000`.