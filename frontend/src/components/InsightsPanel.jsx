import React from 'react';

const InsightsPanel = ({ insights }) => {
  const { ticker, insights: data } = insights;

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getMoonPhaseInsight = () => {
    const fullMoonReturn = data.fullMoonAvgReturn;
    const newMoonReturn = data.newMoonAvgReturn;
    
    if (Math.abs(fullMoonReturn - newMoonReturn) < 0.5) {
      return "📊 No significant correlation detected between moon phases and returns.";
    } else if (fullMoonReturn > newMoonReturn) {
      return "🌕 Full moon periods show higher average returns than new moon periods.";
    } else {
      return "🌑 New moon periods show higher average returns than full moon periods.";
    }
  };

  const getVolatilityInsight = () => {
    const volatility = data.volatilityNearTransitions;
    if (volatility > 3) {
      return "⚡ High volatility detected - consider risk management strategies.";
    } else if (volatility > 1.5) {
      return "📈 Moderate volatility observed during lunar transitions.";
    } else {
      return "😌 Relatively stable price action during moon phase changes.";
    }
  };

  return (
    <div className="insights-panel">
      <div className="panel-header">
        <h2>🔮 Lunar Analysis for {ticker}</h2>
        <p>Statistical insights from {data.totalDaysAnalyzed} trading days</p>
      </div>
      
      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-value">
            {formatPercentage(data.fullMoonAvgReturn)}
          </div>
          <div className="insight-label">
            🌕 Full Moon Returns
          </div>
          <div className="insight-detail">
            {data.fullMoonDays} occurrences
          </div>
        </div>
        
        <div className="insight-card">
          <div className="insight-value">
            {formatPercentage(data.newMoonAvgReturn)}
          </div>
          <div className="insight-label">
            🌑 New Moon Returns
          </div>
          <div className="insight-detail">
            {data.newMoonDays} occurrences
          </div>
        </div>
        
        <div className="insight-card">
          <div className="insight-value">
            {data.volatilityNearTransitions.toFixed(2)}%
          </div>
          <div className="insight-label">
            🌓 Average Volatility
          </div>
          <div className="insight-detail">
            Daily price swings
          </div>
        </div>
        
        <div className="insight-card">
          <div className="insight-value">
            {((data.fullMoonAvgReturn - data.newMoonAvgReturn)).toFixed(2)}%
          </div>
          <div className="insight-label">
            📊 Phase Differential
          </div>
          <div className="insight-detail">
            Full vs New moon
          </div>
        </div>
      </div>

      <div className="ai-insights">
        <h3>🤖 AI-Generated Insights</h3>
        <div className="insight-messages">
          <div className="insight-message">
            {getMoonPhaseInsight()}
          </div>
          <div className="insight-message">
            {getVolatilityInsight()}
          </div>
          <div className="insight-message">
            📈 Based on {data.totalDaysAnalyzed} days of analysis, {ticker} shows {
              Math.abs(data.fullMoonAvgReturn - data.newMoonAvgReturn) > 1 ? 'notable' : 'minimal'
            } lunar correlation patterns.
          </div>
        </div>
      </div>
      
      <div className="methodology-note">
        <p>
          💡 <strong>Analysis Method:</strong> Returns calculated as day-over-day price changes during specific moon phases. 
          Volatility measured as average absolute daily returns. Statistical significance requires larger sample sizes.
        </p>
      </div>
    </div>
  );
};

export default InsightsPanel;