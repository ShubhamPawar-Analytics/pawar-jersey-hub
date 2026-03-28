/**
 * Pawar's Jersey Hub - Order Log to Google Sheet
 * Paste this into your Google Sheet: Extensions → Apps Script
 * Replace the contents of Code.gs with this file, then deploy as Web App.
 * Columns: Order ID, Timestamp, Email, Full Name, City, Firebase UID (optional)
 */

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var params = e.parameter;
  var orderId = params.order_id || '';
  var timestamp = params.timestamp || new Date().toISOString();
  var email = params.email || '';
  var fullName = params.full_name || '';
  var city = params.city || '';
  var firebaseUid = params.firebase_uid || '';

  // Ensure header row exists
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Order ID', 'Timestamp', 'Email', 'Full Name', 'City', 'Firebase UID']);
  }

  if (orderId) {
    sheet.appendRow([orderId, timestamp, email, fullName, city, firebaseUid]);
  }

  return ContentService.createTextOutput(JSON.stringify({ success: true, order_id: orderId }))
    .setMimeType(ContentService.MimeType.JSON);
}
