import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import FinancialAnalysis from './pages/FinancialAnalysis';
import PoliticalUpdates from './pages/PoliticalUpdates';
import AIInsights from './pages/AIInsights';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route path="/financial-analysis" component={FinancialAnalysis} />
                <Route path="/political-updates" component={PoliticalUpdates} />
                <Route path="/ai-insights" component={AIInsights} />
              </Switch>
            </main>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App; 