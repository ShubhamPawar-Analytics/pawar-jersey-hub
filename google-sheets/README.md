# Log orders to Google Sheets

When a customer places an order, the site sends **Order ID**, **Timestamp**, **Email**, **Full Name**, **City**, and **Firebase UID** (when the customer is signed in with Firebase) to a Google Sheet.

## Setup

1. **Create a Google Sheet**  
   - Go to [sheets.new](https://sheets.new).  
   - (Optional) In row 1, add headers: `Order ID` | `Timestamp` | `Email` | `Full Name` | `City` | `Firebase UID`. The script will add them if the sheet is empty.

2. **Add the script**  
   - In the sheet: **Extensions → Apps Script**.  
   - Replace the default `function myFunction() { }` with the code from `OrderLog.gs` in this folder (copy the whole file).  
   - Save (Ctrl+S).

3. **Deploy as Web App**  
   - Click **Deploy → New deployment**.  
   - Click the gear icon, choose **Web app**.  
   - Set **Execute as**: Me.  
   - Set **Who has access**: Anyone (so your website can send requests).  
   - Click **Deploy**, authorize if asked, then copy the **Web app URL** (looks like `https://script.google.com/macros/s/.../exec`).

4. **Add the URL to your website**  
   - Open `js/script.js` in your project.  
   - Find the config: `ORDER_LOG_WEB_APP_URL`.  
   - Paste your Web app URL between the quotes, e.g.:  
     `const ORDER_LOG_WEB_APP_URL = 'https://script.google.com/macros/s/xxxxxxxxxx/exec';`  
   - Save.

After this, each time an order is placed (Place Order on the Payment page), the site will send the order ID, timestamp, email, full name, and city to your sheet and a new row will be added.
