import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Network, UserCheck, ClipboardList, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PanchayathManagement from "@/components/admin/PanchayathManagement";
import AgentManagement from "@/components/admin/AgentManagement";
import HierarchyView from "@/components/admin/HierarchyView";
import TeamManagement from "@/components/admin/TeamManagement";
import TaskManagement from "@/components/admin/TaskManagement";
import Navigation from "@/components/Navigation";

const AgentAdmin = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const adminSections = [
    {
      id: "panchayaths",
      title: "Panchayath Details",
      description: "Manage panchayath information, districts, and ward details",
      icon: <Building2 className="h-6 w-6" />,
      component: <PanchayathManagement />
    },
    {
      id: "agents",
      title: "Agent Management", 
      description: "Add, edit, and manage agent hierarchy and roles",
      icon: <Users className="h-6 w-6" />,
      component: <AgentManagement />
    },
    {
      id: "hierarchy",
      title: "Hierarchy View",
      description: "Visualize and manage organizational structure",
      icon: <Network className="h-6 w-6" />,
      component: <HierarchyView />
    },
    {
      id: "teams",
      title: "Team Management",
      description: "Create teams, assign members, and manage team structures",
      icon: <UserCheck className="h-6 w-6" />,
      component: <TeamManagement />
    },
    {
      id: "tasks",
      title: "Task Management",
      description: "Assign tasks to individuals or teams, track progress",
      icon: <ClipboardList className="h-6 w-6" />,
      component: <TaskManagement />
    }
  ];

  if (activeSection) {
    const section = adminSections.find(s => s.id === activeSection);
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setActiveSection(null)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Panel
            </Button>
            <h1 className="text-3xl font-bold text-foreground">{section?.title}</h1>
            <p className="text-muted-foreground mt-2">{section?.description}</p>
          </div>
          {section?.component}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">Comprehensive management of panchayaths, agents, teams, and tasks</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => (
            <Card 
              key={section.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setActiveSection(section.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {section.icon}
                  </div>
                  {section.title}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Access {section.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentAdmin;