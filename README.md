https://tischglueck-bhuvan.netlify.app/

# Table Bliss — QR Restaurant Order

A German-language, demo-ready QR ordering interface for a restaurant. Guests open a table-specific link, order from the digital menu, and receive a printable bill.

## The start

Prerequisite: Node.js 18 or newer.

```bash
npm install
npm run dev
```
Then open the displayed local address in your browser. For a production build:

```bash
npm run build
```

## QR and table flow
-Each URL carries a table as a parameter, e.g. `http://localhost:5173/?tisch=7`.
-The QR generator opens in the upper right corner. It generates a real QR code for the currently selected table.
-Select table 1–20 there to generate demo codes for additional tables.
-Orders and the last generated receipt are stored locally in the browser so that the process remains visible upon reload.

## Employee view
After launching the app, open the employee overview at:

```text
http://localhost:5173/?admin=1
```

It displays each incoming demo order with table number, order number, dishes, kitchen instructions, total amount, and status. Staff can change the status between **New** , **In Preparation** , **Served** , and **Paid** .

> In this local demo, orders are stored in the browser. Therefore, the customer and employee views must run in the same browser profile. For live operation, the app requires a shared backend so that all devices see the same orders.

## Included demo features
-German categories, dishes, descriptions and European prices
-Shopping cart with quantity control and kitchen advice
-Order check including table and waiting time
-Order confirmation with order number
-German invoice with VAT shown and print/save as PDF
-Responsive design for smartphone and desktop

## Note for a genuine production
This version is intentionally built without a server and uses LocalStorage. For live operation, the menu, tables, and orders should be managed via a backend (e.g., SQLite/Postgres + API), and payments should be processed through a certified payment provider.
