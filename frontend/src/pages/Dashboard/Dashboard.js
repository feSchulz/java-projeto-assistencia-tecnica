import React from "react";
import "./Dashboard.module.css";
import MetricsGrid from '../../components/MetricsGrid'
import OrdersTable from '../../components/OrdersTable'
const Dashboard = () => {
    return (
      <div>
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <MetricsGrid />
          <OrdersTable />
        </main>
      </div>
    );
};

export default Dashboard;