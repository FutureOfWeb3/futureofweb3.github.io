// Google Apps Script for receiving Fireworks Orders
// This script should be deployed as a Web App in Google Apps Script

function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Extract order information
    const customerName = data.customerName;
    const fulfillmentMethod = data.fulfillmentMethod;
    const timestamp = data.timestamp;
    const total = data.total;
    
    // Format items as a string
    const itemsList = data.items.map(item => 
      `${item.name} (Qty: ${item.quantity}, Price: $${item.price}, Subtotal: $${item.subtotal.toFixed(2)})`
    ).join('\n');
    
    // Append a new row with the order data
    sheet.appendRow([
      timestamp,
      customerName,
      fulfillmentMethod.toUpperCase(),
      itemsList,
      `$${total.toFixed(2)}`
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Order received successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Function to set up the spreadsheet with headers
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Add headers if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Customer Name',
      'Fulfillment Method',
      'Items Ordered',
      'Total Amount'
    ]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, 5);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#7b2cbf');
    headerRange.setFontColor('#ffffff');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 5);
  }
}
