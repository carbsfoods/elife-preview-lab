import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, User } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;
  panchayath: string;
  ward?: number;
}

interface AgentSelectorProps {
  selectedAgent: string;
  onAgentSelect: (agentId: string, agentName: string) => void;
}

const AgentSelector = ({ selectedAgent, onAgentSelect }: AgentSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for agents - In real app, this would come from the database
  const [agents] = useState<Agent[]>([
    { id: "1", name: "John Doe", phoneNumber: "9876543210", role: "coordinator", panchayath: "Panchayath A", ward: 1 },
    { id: "2", name: "Jane Smith", phoneNumber: "8765432109", role: "supervisor", panchayath: "Panchayath B", ward: 2 },
    { id: "3", name: "Mike Johnson", phoneNumber: "7654321098", role: "group_leader", panchayath: "Panchayath A", ward: 3 },
    { id: "4", name: "Sarah Wilson", phoneNumber: "6543210987", role: "pro", panchayath: "Panchayath C" },
    { id: "5", name: "David Brown", phoneNumber: "5432109876", role: "coordinator", panchayath: "Panchayath B", ward: 4 },
    { id: "6", name: "Emma Davis", phoneNumber: "4321098765", role: "supervisor", panchayath: "Panchayath D", ward: 1 },
  ]);

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    agent.phoneNumber.includes(searchQuery)
  );

  const selectedAgentData = agents.find(agent => agent.id === selectedAgent);

  return (
    <div className="space-y-3">
      <Label>Assign to Agent *</Label>
      
      {selectedAgentData ? (
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {selectedAgentData.name}
                </h4>
                <p className="text-sm text-muted-foreground">{selectedAgentData.phoneNumber}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{selectedAgentData.role}</Badge>
                  <Badge variant="outline">{selectedAgentData.panchayath}</Badge>
                  {selectedAgentData.ward && <Badge variant="outline">Ward {selectedAgentData.ward}</Badge>}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => onAgentSelect("", "")}
              >
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents by name or mobile number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 border rounded-md p-2">
            {filteredAgents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No agents found matching your search" : "Start typing to search agents"}
              </div>
            ) : (
              filteredAgents.map((agent) => (
                <Card 
                  key={agent.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow hover:border-primary"
                  onClick={() => onAgentSelect(agent.id, agent.name)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{agent.name}</h4>
                        <p className="text-sm text-muted-foreground">{agent.phoneNumber}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{agent.role}</Badge>
                          <Badge variant="outline" className="text-xs">{agent.panchayath}</Badge>
                          {agent.ward && <Badge variant="outline" className="text-xs">Ward {agent.ward}</Badge>}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentSelector;