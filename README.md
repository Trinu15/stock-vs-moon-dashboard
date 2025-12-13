# 🌙 Stock vs Moon Dashboard

A full-stack web application that analyzes stock price movements in correlation with lunar cycles. This project combines financial data from AlphaVantage with astronomical calculations to provide unique insights into potential market patterns.

## 🚀 Features

### 📊 Core Analysis
- **Real-time Stock Data**: Fetches daily stock prices using AlphaVantage API
- **Moon Phase Calculations**: Accurate lunar cycle data using SunCalc library
- **Interactive Charts**: Beautiful visualizations with Recharts showing price movements and moon phases
- **Advanced Period Filtering**: Analyze data across 1M, 3M, 6M, 1Y, 5Y, or custom date ranges
- **AI-Powered Insights**: Statistical analysis with intelligent pattern recognition

### 🔄 Multi-Stock Comparison
- **Side-by-Side Analysis**: Compare up to 5 stocks simultaneously
- **Relative Performance**: Visual comparison of returns across different assets
- **Cross-Asset Correlation**: Analyze how different stocks behave during lunar cycles

### 🎯 Strategy Backtesting
- **Moon Swing Strategy**: Buy on new moon, sell on full moon
- **Inverse Moon Strategy**: Buy on full moon, sell on new moon  
- **Buy & Hold Baseline**: Traditional strategy comparison
- **Performance Metrics**: ROI, Sharpe ratio, win rate, max drawdown

### 🎨 Professional UI/UX
- **Clean Dashboard Design**: Intuitive layout with clear sections
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Loading States & Error Handling**: Professional user experience
- **Methodology Explanation**: Built-in educational content

### 🛠️ Technical Features
- **Docker Support**: Easy deployment with containerization
- **Custom Date Ranges**: Flexible analysis periods
- **Error Recovery**: Graceful handling of API limits and invalid tickers

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Recharts** - Data visualization library
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **SunCalc** - Astronomical calculations
- **Axios** - External API integration
- **CORS** - Cross-origin resource sharing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📋 Prerequisites

- Node.js 18+ installed
- AlphaVantage API key (free at [alphavantage.co](https://www.alphavantage.co/support/#api-key))
- Docker (optional, for containerized deployment)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd stock-vs-moon-dashboard
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` and add your AlphaVantage API key:
```
ALPHA_VANTAGE_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
```

### 3. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 4. Development Mode
```bash
# From root directory - runs both frontend and backend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🐳 Docker Deployment

### Build and Run with Docker Compose
```bash
docker-compose up --build
```

This will:
- Build both frontend and backend containers
- Start the services with proper networking
- Make the app available at http://localhost:3000

## 📊 API Endpoints

### Get Stock Data with Moon Phases
```
GET /api/stock/:ticker?period=1M
```

**Parameters:**
- `ticker`: Stock symbol (e.g., AAPL, GOOGL)
- `period`: Time range (1M, 3M, 6M, 1Y)

**Response:**
```json
{
  "ticker": "AAPL",
  "period": "1M",
  "data": [
    {
      "date": "2024-01-15",
      "open": 185.92,
      "high": 186.40,
      "low": 185.19,
      "close": 185.92,
      "volume": 47317442,
      "moonPhase": {
        "fraction": 0.23,
        "phase": 0.15,
        "name": "waxing-crescent"
      }
    }
  ]
}
```

### Get Moon Phase Insights
```
GET /api/stock/:ticker/insights
```

Returns statistical analysis of stock performance during different moon phases.

## 🎯 Usage

### Single Stock Analysis
1. **Enter Stock Ticker**: Type any valid stock symbol (e.g., AAPL, TSLA, GOOGL, BTC-USD)
2. **Select Time Period**: Choose from 1M, 3M, 6M, 1Y, 5Y, or set custom dates
3. **Click Analyze**: View the interactive chart with moon phase overlays
4. **Review Insights**: AI-powered analysis of lunar correlations
5. **Check Backtesting**: See how different moon-based strategies would perform

### Multi-Stock Comparison
1. **Switch to Comparison Tab**: Click "Multi-Stock Comparison"
2. **Add Stocks**: Enter up to 5 different tickers
3. **Set Time Period**: Choose analysis timeframe
4. **Compare Performance**: View side-by-side charts and returns

### Understanding Results
- **🌕 Full Moon Markers**: Yellow dots on significant full moons
- **🌑 New Moon Markers**: Dark dots on new moon phases
- **Hover for Details**: Interactive tooltips with moon phase data
- **Strategy Performance**: Backtesting results with key metrics

## 📈 Understanding the Analysis

### Visualization Elements
- **Price Chart**: Daily closing prices with smooth trend lines
- **Moon Phase Overlays**: 🌕 (Full Moon) and 🌑 (New Moon) markers
- **Interactive Tooltips**: Detailed moon phase and price data
- **Multi-Stock Colors**: Distinct colors for easy comparison

### Statistical Insights
- **Phase Returns**: Average returns during specific moon phases
- **Volatility Analysis**: Price movement patterns near lunar transitions  
- **Correlation Metrics**: Statistical significance of lunar patterns
- **AI Interpretations**: Automated insights and pattern recognition

### Backtesting Methodology
- **Moon Swing**: Systematic buying on new moons, selling on full moons
- **Inverse Strategy**: Contrarian approach with opposite timing
- **Risk Metrics**: Drawdown analysis and risk-adjusted returns
- **Benchmark Comparison**: Performance vs traditional buy-and-hold

## 🔍 Project Structure

```
stock-vs-moon-dashboard/
├── .kiro/                    # Kiro IDE configuration
│   ├── settings/
│   │   └── workspace.json    # Project settings
│   ├── steering/
│   │   └── development.md    # Development guidelines
│   └── README.md
├── backend/
│   ├── routes/
│   │   └── stock.js          # API routes
│   ├── server.js             # Express server
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StockChart.jsx
│   │   │   └── InsightsPanel.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## 🚨 Important Notes

- **API Rate Limits**: AlphaVantage free tier allows 5 requests per minute
- **Data Accuracy**: Moon phase calculations are astronomically accurate
- **Investment Disclaimer**: This tool is for educational/entertainment purposes only
- **CORS**: Backend configured to accept requests from frontend origin

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [AlphaVantage](https://www.alphavantage.co/) for stock market data
- [SunCalc](https://github.com/mourner/suncalc) for astronomical calculations
- [Recharts](https://recharts.org/) for beautiful data visualizations

---

**Disclaimer**: This application is for educational and entertainment purposes only. The correlation between stock prices and moon phases is not scientifically proven and should not be used for actual investment decisions.