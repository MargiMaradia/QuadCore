// CSV Export Utility Functions

/**
 * Convert array of objects to CSV string
 */
export const arrayToCSV = (data, headers = null) => {
  if (!data || data.length === 0) {
    return '';
  }

  // Auto-generate headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Escape CSV values
  const escapeCSV = (value) => {
    if (value === null || value === undefined) {
      return '';
    }
    const stringValue = String(value);
    // If value contains comma, newline, or quote, wrap in quotes and escape quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Create header row
  const headerRow = csvHeaders.map(escapeCSV).join(',');

  // Create data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header];
      // Handle nested objects
      if (typeof value === 'object' && value !== null) {
        return escapeCSV(JSON.stringify(value));
      }
      return escapeCSV(value);
    }).join(',');
  });

  // Combine header and data rows
  return [headerRow, ...dataRows].join('\n');
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent, filename) => {
  // Add BOM for UTF-8 to support Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename || 'export.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Export stock data to CSV
 */
export const exportStockToCSV = (stockData, warehouses = []) => {
  const csvData = stockData.map(item => ({
    'Product Name': item.product?.name || '',
    'SKU': item.product?.sku || '',
    'Warehouse': item.warehouse?.name || item.warehouse?.code || '',
    'Location': item.location?.name || item.location?.code || '',
    'Quantity': item.quantity || 0,
    'Reserved': item.reservedQuantity || 0,
    'Available': item.availableQuantity || 0,
    'Unit Price': item.product?.costPrice || 0,
    'Total Value': (item.quantity || 0) * (item.product?.costPrice || 0),
  }));

  const csv = arrayToCSV(csvData);
  const filename = `stock-export-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
};

/**
 * Export products to CSV
 */
export const exportProductsToCSV = (products) => {
  const csvData = products.map(product => ({
    'Name': product.name || '',
    'SKU': product.sku || '',
    'Category': product.category || '',
    'Unit of Measure': product.unitOfMeasure || '',
    'Cost Price': product.costPrice || 0,
    'Selling Price': product.sellingPrice || 0,
    'Reorder Point': product.reorderPoint || 0,
    'Reorder Quantity': product.reorderQuantity || 0,
    'Barcode': product.barcode || '',
  }));

  const csv = arrayToCSV(csvData);
  const filename = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
};

/**
 * Export deliveries to CSV
 */
export const exportDeliveriesToCSV = (deliveries) => {
  const csvData = deliveries.map(delivery => ({
    'Delivery Number': delivery.deliveryNumber || '',
    'Customer Name': delivery.customer?.name || '',
    'Contact': delivery.customer?.contact || '',
    'Address': delivery.customer?.address || '',
    'Status': delivery.status || '',
    'Items Count': delivery.items?.length || 0,
    'Created Date': delivery.createdAt ? new Date(delivery.createdAt).toLocaleDateString() : '',
  }));

  const csv = arrayToCSV(csvData);
  const filename = `deliveries-export-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
};

/**
 * Export receipts to CSV
 */
export const exportReceiptsToCSV = (receipts) => {
  const csvData = receipts.map(receipt => ({
    'Receipt Number': receipt.receiptNumber || '',
    'Supplier': receipt.supplier?.name || '',
    'Contact': receipt.supplier?.contact || '',
    'Warehouse': receipt.warehouse?.name || receipt.warehouse?.code || '',
    'Status': receipt.status || '',
    'Items Count': receipt.items?.length || 0,
    'Created Date': receipt.createdAt ? new Date(receipt.createdAt).toLocaleDateString() : '',
  }));

  const csv = arrayToCSV(csvData);
  const filename = `receipts-export-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
};

