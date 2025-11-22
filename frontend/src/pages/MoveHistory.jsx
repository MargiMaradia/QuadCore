import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMoves } from '../data/mockData';
import { ArrowRight, ArrowLeft, ArrowRightLeft } from 'lucide-react';

const MoveHistory = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <button 
            onClick={() => navigate('/warehouses')}
            className="flex items-center gap-2 text-silk-mauve hover:text-silk-charcoal mb-2 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Warehouses</span>
          </button>
          <h1 className="text-2xl font-bold text-silk-charcoal">Move History</h1>
          <p className="text-silk-mauve">Track all product movements across locations.</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-silk-clay overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-silk-clay text-silk-mauve text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Reference</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">From</th>
                <th className="p-4 font-medium">To</th>
                <th className="p-4 font-medium text-right">Quantity</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-silk-clay">
              {mockMoves.map((move) => (
                <tr key={move._id} className="hover:bg-silk-sand/10 transition-colors">
                  <td className="p-4 font-medium text-silk-charcoal">{move.reference}</td>
                  <td className="p-4 text-sm text-silk-mauve">{move.date}</td>
                  <td className="p-4 text-sm text-silk-charcoal">{move.contact}</td>
                  <td className="p-4 text-sm font-medium text-silk-charcoal">{move.product}</td>
                  <td className="p-4 text-sm text-silk-mauve">
                    <span className={`inline-flex items-center gap-1 ${move.type === 'out' ? 'text-red-600' : ''}`}>
                      {move.from}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-silk-mauve">
                    <span className={`inline-flex items-center gap-1 ${move.type === 'in' ? 'text-green-600' : ''}`}>
                      {move.to}
                    </span>
                  </td>
                  <td className={`p-4 text-right font-medium ${move.type === 'in' ? 'text-green-600' : move.type === 'out' ? 'text-red-600' : 'text-silk-charcoal'}`}>
                    {move.type === 'in' ? '+' : move.type === 'out' ? '-' : ''}{move.quantity}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium capitalize bg-gray-100 text-gray-800 rounded-sm">
                      {move.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MoveHistory;
