import React, { useState } from 'react';

const BacktestPanel = ({ results }) => {
  const [selectedStrategy, setSelectedStrategy] = useState('moonSwing');

  const strategies = {
    moonSwing: {
      name: 'Moon Swing Strategy',
      description: 'Buy on new moon, sell on full moon',
      icon: '🌑➡️🌕'
    },
    inverseMoon: {
      name: 'Inverse Moon Strategy', 
      description: 'Buy on full moon, sell on new moon',
      icon: '🌕➡️🌑'
    },
    buyHold: {
      name: 'Buy & Hold',
      description: 'Traditional buy and hold strategy',
      icon: '📈'
    }
  };

  const currentStrategy = results?.strategies?.[selectedStrategy] || {
    totalReturn: 0,
    annualizedReturn: 0,
    maxDrawdown: 0,
    winRate: 0,
    totalTrades: 0,
    sharpeRatio: 0
  };

  const formatPercentage = (value) => {
    const formatted = (value * 100).toFixed(2);
    return `${value > 0 ? '+' : ''}${formatted}%`;
  };

  const formatCurrency = (value) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="backtest-panel">
      <div className="panel-header">
        <h2>🎯 Strategy Backtesting</h2>
        <p>Historical performance analysis</p>
      </div>

      <div className="strategy-selector">
        <label>Trading Strategy:</label>
        <select 
          value={selectedStrategy}
          onChange={(e) => setSelectedStrategy(e.target.value)}
          className="strategy-dropdown"
        >
          {Object.entries(strategies).map(([key, strategy]) => (
            <option key={key} value={key}>
              {strategy.icon} {strategy.name}
            </option>
          ))}
        </select>
        <p className="strategy-description">
          {strategies[selectedStrategy].description}
        </p>
      </div>

      <div className="backtest-metrics">
        <div className="metrics-grid">
          <div className="metric-card primary">
            <div className="metric-value">
              {formatPercentage(currentStrategy.totalReturn)}
            </div>
            <div className="metric-label">Total Return</div>
          </div>

          <div className="metric-card">
            <div className="metric-value">
              {formatPercentage(currentStrategy.annualizedReturn)}
            </div>
            <div className="metric-label">Annualized Return</div>
          </div>

          <div className="metric-card">
            <div className="metric-value">
              {formatPercentage(Math.abs(currentStrategy.maxDrawdown))}
            </div>
            <div className="metric-label">Max Drawdown</div>
          </div>

          <div className="metric-card">
            <div className="metric-value">
              {(currentStrategy.winRate * 100).toFixed(1)}%
            </div>
            <div className="metric-label">Win Rate</div>
          </div>

          <div className="metric-card">
            <div className="metric-value">
              {currentStrategy.totalTrades}
            </div>
            <div className="metric-label">Total Trades</div>
          </div>

          <div className="metric-card">
            <div className="metric-value">
              {currentStrategy.sharpeRatio.toFixed(2)}
            </div>
            <div className="metric-label">Sharpe Ratio</div>
          </div>
        </div>
      </div>

      <div className="strategy-comparison">
        <h3>📊 Strategy Comparison</h3>
        <div className="comparison-table">
          <div className="table-header">
            <div>Strategy</div>
            <div>Total Return</div>
            <div>Win Rate</div>
            <div>Trades</div>
          </div>
          {Object.entries(strategies).map(([key, strategy]) => {
            const strategyData = results?.strategies?.[key] || {};
            return (
              <div key={key} className={`table-row ${key === selectedStrategy ? 'selected' : ''}`}>
                <div className="strategy-name">
                  {strategy.icon} {strategy.name}
                </div>
                <div className={`return-value ${strategyData.totalReturn > 0 ? 'positive' : 'negative'}`}>
                  {formatPercentage(strategyData.totalReturn || 0)}
                </div>
                <div>{((strategyData.winRate || 0) * 100).toFixed(1)}%</div>
                <div>{strategyData.totalTrades || 0}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="backtest-disclaimer">
        <p>
          ⚠️ <strong>Backtesting Disclaimer:</strong> Past performance is not indicative of future results. 
          These strategies are theoretical and do not account for transaction costs, slippage, or market impact.
        </p>
      </div>
    </div>
  );
};

export default BacktestPanel;