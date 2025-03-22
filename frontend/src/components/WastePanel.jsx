import React from 'react';
const WastePanel = () => {
    return (
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Waste Management</h2>
        <ul className="space-y-2 list-disc list-inside text-gray-300">
          <li>Waste Container A - Full</li>
          <li>Waste Container B - 75%</li>
          <li>Waste Container C - Empty</li>
        </ul>
      </div>
    );
  };
  
  export default WastePanel;
  
  