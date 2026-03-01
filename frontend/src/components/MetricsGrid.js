import React from 'react';

const metrics = [
    { title: 'Pedidos do dia', value: '24', change: '+12% vs ontem', color: 'green' },
    { title: 'Faturamento do mês', value: 'R$ 45.320', change: '+8%', color: 'green' },
    { title: 'Novos clientes', value: '8', change: '+3', color: 'blue' },
    { title: 'Pedidos pendentes', value: '3', change: '-1', color: 'orange' },
];

const MetricsGrid = () => (
    <div className="grid grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-gray-500 text-sm font-medium mb-2">{metric.title}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className={`text-sm ${metric.color === 'green' ? 'text-green-600' :
                    metric.color === 'orange' ? 'text-orange-600' : 'text-blue-600'}`}>
                    {metric.change}
                </div>
            </div>
        ))}
    </div>
);

export default MetricsGrid;
