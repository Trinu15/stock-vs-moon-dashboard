import React from 'react';

const MethodologyModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🌙 Methodology: Stock vs Moon Analysis</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <section className="methodology-section">
            <h3>🎯 Why This Mashup?</h3>
            <p>
              This dashboard explores the fascinating intersection of financial markets and astronomical cycles. 
              While scientifically unproven, lunar cycles have been studied in relation to market behavior 
              for decades, with some traders believing moon phases influence market sentiment and volatility.
            </p>
          </section>

          <section className="methodology-section">
            <h3>📊 Data Sources</h3>
            <div className="data-sources">
              <div className="source-card">
                <h4>📈 Stock Data</h4>
                <p><strong>AlphaVantage API</strong></p>
                <ul>
                  <li>Daily OHLCV data</li>
                  <li>Real-time market prices</li>
                  <li>Historical data up to 20+ years</li>
                </ul>
              </div>
              <div className="source-card">
                <h4>🌙 Lunar Data</h4>
                <p><strong>SunCalc Library</strong></p>
                <ul>
                  <li>Precise astronomical calculations</li>
                  <li>Moon phase percentages</li>
                  <li>Phase transition dates</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="methodology-section">
            <h3>🔍 Analysis Methods</h3>
            <div className="analysis-methods">
              <div className="method-card">
                <h4>📊 Statistical Analysis</h4>
                <ul>
                  <li>Average returns during each moon phase</li>
                  <li>Volatility measurements near phase transitions</li>
                  <li>Correlation coefficients</li>
                </ul>
              </div>
              <div className="method-card">
                <h4>📈 Backtesting Strategies</h4>
                <ul>
                  <li><strong>Moon Swing:</strong> Buy on new moon, sell on full moon</li>
                  <li><strong>Inverse Moon:</strong> Buy on full moon, sell on new moon</li>
                  <li><strong>Buy & Hold:</strong> Traditional baseline strategy</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="methodology-section">
            <h3>🎨 Visualization Features</h3>
            <ul>
              <li><strong>Interactive Charts:</strong> Hover for detailed moon phase data</li>
              <li><strong>Phase Overlays:</strong> Visual markers for significant lunar events</li>
              <li><strong>Multi-timeframe Analysis:</strong> From 1 month to 5 years</li>
              <li><strong>Comparative Analysis:</strong> Side-by-side stock comparisons</li>
            </ul>
          </section>

          <section className="methodology-section disclaimer">
            <h3>⚠️ Important Disclaimer</h3>
            <p>
              This analysis is for <strong>educational and entertainment purposes only</strong>. 
              The correlation between lunar cycles and stock prices is not scientifically established. 
              Past performance does not guarantee future results. Always consult with financial 
              advisors before making investment decisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MethodologyModal;