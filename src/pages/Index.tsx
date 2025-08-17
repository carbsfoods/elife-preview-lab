import { useNavigate } from "react-router-dom";
import DashboardCard from "@/components/DashboardCard";
import { Users, FileText, CheckSquare, Settings } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    {
      title: "ഏജൻ്റുമാരെ ചേർക്കുക",
      description: "Manage agents and staff members for efficient operations",
      icon: <Users className="h-6 w-6" />,
      buttonText: "Manage Staff",
      href: "/add-agents"
    },
    {
      title: "ഡെയിലി നോട്ട്",
      description: "Log and track daily activities for agents",
      icon: <FileText className="h-6 w-6" />,
      buttonText: "Daily Activity Log",
      href: "/daily-notes"
    },
    {
      title: "Check Points",
      description: "Check agent points based on daily activities",
      icon: <CheckSquare className="h-6 w-6" />,
      buttonText: "Check Points",
      href: "/check-points"
    },
    {
      title: "Agent Admin Panel",
      description: "Team member access to admin features and management tools",
      icon: <Settings className="h-6 w-6" />,
      buttonText: "Access Admin Panel",
      href: "/agent-admin"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              Agent Management System
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
              Comprehensive dashboard for managing agents, tracking activities, and monitoring performance
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {dashboardItems.map((item, index) => (
            <div 
              key={index} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <DashboardCard
                title={item.title}
                description={item.description}
                icon={item.icon}
                buttonText={item.buttonText}
                onClick={() => navigate(item.href)}
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
