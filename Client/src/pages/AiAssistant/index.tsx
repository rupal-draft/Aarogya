"use client";

import { useState } from "react";
import ChatInterface from "../../components/Assistant/ChatInterface";
import MedicalHistory from "../../components/History/MedicalHistory";
import Dashboard from "../../components/Assistant/AssistantDashboard";
import Button from "../../common/Ui/Button";

type View = "dashboard" | "chat" | "history";

function Assistant() {
  const [currentView, setCurrentView] = useState<View>("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "chat":
        return <ChatInterface />;
      case "history":
        return <MedicalHistory />;
      default:
        return (
          <Dashboard
            onStartChat={() => setCurrentView("chat")}
            onViewHistory={() => setCurrentView("history")}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentView("dashboard")}
                className="text-xl font-bold text-medical-600 hover:text-medical-700 transition-colors"
              >
                🏥 Medical Assistant
              </button>
            </div>

            <div className="flex space-x-4">
              <Button
                variant={currentView === "dashboard" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant={currentView === "chat" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("chat")}
              >
                Chat
              </Button>
              <Button
                variant={currentView === "history" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("history")}
              >
                History
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "chat" ? (
          <div className="h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {renderView()}
          </div>
        ) : (
          renderView()
        )}
      </main>
    </div>
  );
}

export default Assistant;
