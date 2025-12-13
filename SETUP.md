# 🚀 Stock vs Moon Dashboard - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Git (optional, for version control)
- AlphaVantage API key (free at [alphavantage.co](https://www.alphavantage.co/support/#api-key))

### Installation

1. **Clone or Download** this repository
2. **Install Dependencies**:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env and add your AlphaVantage API key
   ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```

5. **Open Browser**: http://localhost:3000

## 📁 Project Structure

```
stock-vs-moon-dashboard/
├── backend/                 # Node.js + Express API
│   ├── routes/
│   │   └── stock.js        # Stock data & moon phase endpoints
│   ├── server.js           # Express server setup
│   └── package.json
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx         # Main application
│   │   └── index.css       # Styles
│   └── package.json
├── docker-compose.yml      # Docker orchestration
├── .env.example           # Environment template
└── README.md              # Documentation
```

## 🔧 Configuration

### Environment Variables (.env)
```env
# AlphaVantage API Key (get free key at alphavantage.co)
ALPHA_VANTAGE_API_KEY=your_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

### Docker Deployment
```bash
docker-compose up --build
```

## 🎯 Features

- **Real-time Stock Data** with AlphaVantage API
- **Moon Phase Calculations** using SunCalc
- **Interactive Charts** with Recharts
- **Multi-Stock Comparison** (up to 5 stocks)
- **Strategy Backtesting** (Moon Swing, Inverse, Buy & Hold)
- **AI-Powered Insights** with pattern recognition
- **Custom Date Ranges** and period filtering
- **Responsive Design** for all devices

## 🚨 Troubleshooting

### "No data found for ticker"
- Check your AlphaVantage API key in `.env`
- The app uses mock data in demo mode (API key = "demo")
- Free API keys have rate limits (5 requests/minute)

### Port Already in Use
```bash
# Kill processes on ports 3000/3001
npx kill-port 3000 3001
```

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json  
rm -rf frontend/node_modules frontend/package-lock.json
npm install
```

## 📊 API Endpoints

- `GET /api/stock/:ticker` - Stock data with moon phases
- `GET /api/stock/:ticker/insights` - Statistical analysis
- `GET /api/stock/:ticker/backtest` - Strategy performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details