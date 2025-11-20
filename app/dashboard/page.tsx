"use client";

import project_management from "@/assets/project_management.svg";
import purchase from "@/assets/purchase.svg";
import sales from "@/assets/sales.svg";
import inventory from "@/assets/inventory.svg";
import operations from "@/assets/operations.svg";
import accounting from "@/assets/accounting.svg";
import DashboardCard from "@/components/dashboard/DashboardCard";

interface CardData {
  title: string;
  items: string[];
  icon: string; // imported static asset
}

const Dashboard: React.FC = () => {

  const firstRow: CardData[] = [
    {
      title: "Project Management",
      items: ["Project Name 01", "Project Name 02"],
      icon: project_management,
    },
    {
      title: "Purchase",
      items: ["Purchase Orders", "Purchase Quotes", "Vendors"],
      icon: purchase,
    },
    {
      title: "Inventory",
      items: [
        "Product",
        "Reorder",
        "Current Stock",
        "Stock Transfer",
        "Stock Adjustment",
        "Stock Counts",
      ],
      icon: inventory,
    },
    {
      title: "Sales",
      items: [
        "Sales Orders / Rental Orders",
        "Sales Quotes / Rental Quotes",
        "Customers",
        "Leads / CRM",
      ],
      icon: sales,
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50 flex flex-col justify-between">

      {/* 🔵 MAIN CONTENT */}
      <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto flex flex-col flex-1">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 drop-shadow-sm">
            Welcome Back Gunjan!
          </h1>
          <p className="text-gray-500 text-sm">
            Here’s an overview of your inventory and business today.
          </p>
        </div>

        {/* FIRST ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {firstRow.map((card, i) => (
            <div key={i} className="transform hover:-translate-y-1 transition-all duration-200">
              <DashboardCard title={card.title} items={card.items} icon={card.icon} />
            </div>
          ))}
        </div>

        {/* SECOND ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <div className="transform hover:-translate-y-1 transition-all duration-200">
            <DashboardCard
              title="Operations"
              items={[
                "Logistics / Movements",
                "Upload POD’s",
                "Personnel Management",
                "Missing and Damage Estimates",
                "Order Status",
                "Task Management",
              ]}
              icon={operations}
            />
          </div>

          <div className="transform hover:-translate-y-1 transition-all duration-200">
            <DashboardCard
              title="Expenses / Approvals / Requests"
              items={[
                "Travel Expense / Conveyance",
                "Daily Expense Log / Requests",
                "Creditors / Payments",
                "Employee Requests",
                "Payment Requests",
                "Pickup Initialization Requests",
              ]}
              icon={accounting}
            />
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default Dashboard;
