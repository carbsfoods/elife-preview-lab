import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Building2, Users, Network } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PanchayathManagement from "@/components/admin/PanchayathManagement";
import AgentManagement from "@/components/admin/AgentManagement";
import HierarchyView from "@/components/admin/HierarchyView";

const AgentAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">Panchayath and agent hierarchy management</p>
        </div>
        
        <Tabs defaultValue="panchayaths" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="panchayaths" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Panchayath Details
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Agent Management
            </TabsTrigger>
            <TabsTrigger value="hierarchy" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Hierarchy View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="panchayaths" className="mt-6">
            <PanchayathManagement />
          </TabsContent>
          
          <TabsContent value="agents" className="mt-6">
            <AgentManagement />
          </TabsContent>
          
          <TabsContent value="hierarchy" className="mt-6">
            <HierarchyView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentAdmin;