// src/components/client/ClientsList.tsx
import React from 'react';

type Props = {
  onSelectClient?: (id: string) => void;
};

export default function ClientsList({ onSelectClient }: Props) {
  // Voor nu: simpele placeholder, zodat de build altijd slaagt
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">All Clients</h2>
      <p className="text-gray-500">Nog geen data (placeholder).</p>
      {onSelectClient && (
        <button
          onClick={() => onSelectClient('demo-id')}
          className="mt-3 px-3 py-2 text-sm rounded bg-blue-600 text-white"
        >
          Selecteer demo-cliënt
        </button>
      )}
    </div>
  );
}