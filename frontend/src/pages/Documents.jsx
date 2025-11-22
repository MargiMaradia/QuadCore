import React, { useState } from 'react';
import { mockOperations, mockProducts } from '../data/mockData';
import { Printer, Search, FileText, Download } from 'lucide-react';

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const operations = mockOperations.filter(op => 
    op.ref.toLowerCase().includes(searchTerm.toLowerCase()) || 
    op.contact?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-silk-charcoal">Documents & Receipts</h1>
          <p className="text-silk-mauve">Generate and print order documentation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List Section */}
        <div className="lg:col-span-1 space-y-4 print:hidden">
          <div className="bg-white p-4 shadow-sm border border-silk-clay">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-silk-mauve" size={18} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="w-full pl-10 pr-4 py-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white shadow-sm border border-silk-clay max-h-[600px] overflow-y-auto">
            {operations.map(op => (
              <div 
                key={op._id}
                onClick={() => setSelectedOrder(op)}
                className={`p-4 border-b border-silk-clay cursor-pointer transition-colors hover:bg-gray-50
                  ${selectedOrder?._id === op._id ? 'bg-silk-sand/30 border-l-4 border-l-silk-gold' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-silk-charcoal">{op.ref}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-sm capitalize
                    ${op.type === 'receipt' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                    {op.type}
                  </span>
                </div>
                <p className="text-sm text-silk-charcoal truncate">{op.contact}</p>
                <p className="text-xs text-silk-mauve mt-1">{op.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="bg-white shadow-sm border border-silk-clay min-h-[600px] flex flex-col">
              {/* Toolbar */}
              <div className="p-4 border-b border-silk-clay flex justify-between items-center bg-gray-50 print:hidden">
                <h3 className="font-bold text-silk-charcoal">Document Preview</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-silk-charcoal text-silk-gold font-medium hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    <Printer size={18} />
                    Print / Download
                  </button>
                </div>
              </div>

              {/* Printable Content */}
              <div className="p-8 flex-1" id="printable-area">
                {/* Header */}
                <div className="flex justify-between items-start mb-8 pb-8 border-b-2 border-silk-charcoal">
                  <div>
                    <div className="flex items-center gap-1 select-none mb-2">
                      <div className="bg-silk-charcoal text-silk-gold px-2 py-1 font-bold text-xl tracking-wider">
                        STOCK
                      </div>
                      <div className="border-2 border-silk-charcoal text-silk-charcoal px-2 py-1 font-bold text-xl tracking-wider">
                        SYNC
                      </div>
                    </div>
                    <p className="text-sm text-silk-mauve">123 Logistics Blvd, New York, NY 10001</p>
                    <p className="text-sm text-silk-mauve">support@stocksync.com</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-3xl font-bold text-silk-charcoal uppercase tracking-wide mb-1">
                      {selectedOrder.type === 'receipt' ? 'Receipt' : 'Delivery Order'}
                    </h2>
                    <p className="font-mono text-lg text-silk-mauve">{selectedOrder.ref}</p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-xs font-bold text-silk-mauve uppercase tracking-wider mb-2">From</h4>
                    <p className="font-bold text-silk-charcoal">{selectedOrder.contact}</p>
                    <p className="text-sm text-silk-charcoal">{selectedOrder.from || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-silk-mauve uppercase tracking-wider mb-2">Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-silk-mauve">Date:</p>
                        <p className="font-medium text-silk-charcoal">{selectedOrder.date}</p>
                      </div>
                      <div>
                        <p className="text-silk-mauve">Status:</p>
                        <p className="font-medium text-silk-charcoal capitalize">{selectedOrder.status}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-8">
                  <thead>
                    <tr className="border-b-2 border-silk-charcoal">
                      <th className="text-left py-3 font-bold text-silk-charcoal">Item / Description</th>
                      <th className="text-right py-3 font-bold text-silk-charcoal">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-silk-clay">
                    {selectedOrder.items.map((item, idx) => {
                      const productName = item.productName || mockProducts.find(p => p._id === item.product)?.name || item.product;
                      return (
                        <tr key={idx}>
                          <td className="py-3 text-silk-charcoal">{productName}</td>
                          <td className="py-3 text-right font-mono text-silk-charcoal">{item.qty}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Footer */}
                <div className="mt-auto pt-8 border-t border-silk-clay text-center text-sm text-silk-mauve">
                  <p>Thank you for your business.</p>
                  <p className="text-xs mt-2">Generated on {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm border border-silk-clay h-[600px] flex flex-col items-center justify-center text-silk-mauve print:hidden">
              <FileText size={48} className="mb-4 opacity-20" />
              <p>Select an order to view document</p>
            </div>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          @page {
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Documents;
