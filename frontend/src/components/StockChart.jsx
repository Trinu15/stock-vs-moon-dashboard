import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

const moonIcons = {
  'new': '🌑',
  'waxing-crescent': '🌒',
  'full': '🌕',
  'waning-crescent': '🌘'
};

const StockChart = ({ data }) => {
  const { ticker, period, data: stockData } = data;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p><strong>Date:</strong> {label}</p>
          <p><strong>Close:</strong> ${payload[0].value.toFixed(2)}</p>
          <p><strong>Moon Phase:</strong> {moonIcons[data.moonPhase.name]} {data.moonPhase.name}</p>
          <p><strong>Illumination:</strong> {(data.moonPhase.fraction * 100).toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  // Find significant moon phases for overlay
  const moonPhasePoints = stockData.filter((item, index) => {
    if (index === 0) return false;
    const prev = stockData[index - 1];
    return item.moonPhase.name !== prev.moonPhase.name && 
           (item.moonPhase.name === 'full' || item.moonPhase.name === 'new');
  });

  return (
    <div className="chart-container">
      <h2>{ticker} Stock Price vs Moon Phases ({period})</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={stockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis 
            domain={['dataMin - 5', 'dataMax + 5']}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#667eea" 
            strokeWidth={2}
            dot={false}
          />
          
          {/* Moon phase overlays */}
          {moonPhasePoints.map((point, index) => (
            <ReferenceDot
              key={index}
              x={point.date}
              y={point.close}
              r={8}
              fill={point.moonPhase.name === 'full' ? '#FFD700' : '#4A4A4A'}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        <p>🌕 Full Moon &nbsp;&nbsp; 🌑 New Moon</p>
      </div>
    </div>
  );
};

export default StockChart;