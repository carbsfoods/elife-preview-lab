import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserCheck, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;
  panchayath: string;
  ward?: number;
  isExistingAgent: boolean;
  originalRole?: string;
}

interface Agent {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;
  panchayath: string;
  ward?: number;
}

interface TeamMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (member: TeamMember) => void;
  existingMembers: TeamMember[];
}

const TeamMemberDialog = ({ isOpen, onOpenChange, onAddMember, existingMembers }: TeamMemberDialogProps) => {
  const [activeTab, setActiveTab] = useState("existing");
  const [searchQuery, setSearchQuery] = useState("");
  
  // New member form state
  const [newMember, setNewMember] = useState({
    name: "",
    phoneNumber: "",
    panchayath: "",
    ward: ""
  });

  // Mock data for existing agents - In real app, this would come from the database
  const [agents] = useState<Agent[]>([
    { id: "1", name: "John Doe", phoneNumber: "9876543210", role: "coordinator", panchayath: "Panchayath A", ward: 1 },
    { id: "2", name: "Jane Smith", phoneNumber: "8765432109", role: "supervisor", panchayath: "Panchayath B", ward: 2 },
    { id: "3", name: "Mike Johnson", phoneNumber: "7654321098", role: "group_leader", panchayath: "Panchayath A", ward: 3 },
    { id: "4", name: "Sarah Wilson", phoneNumber: "6543210987", role: "pro", panchayath: "Panchayath C" },
  ]);

  // Mock panchayaths - In real app, this would come from the database
  const panchayaths = [
    "Panchayath A",
    "Panchayath B", 
    "Panchayath C",
    "Panchayath D"
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         agent.phoneNumber.includes(searchQuery);
    const notAlreadyMember = !existingMembers.some(member => member.phoneNumber === agent.phoneNumber);
    return matchesSearch && notAlreadyMember;
  });

  const handleAddExistingAgent = (agent: Agent) => {
    const newRole = `${agent.role} + team member`;
    const teamMember: TeamMember = {
      id: crypto.randomUUID(),
      name: agent.name,
      phoneNumber: agent.phoneNumber,
      role: newRole,
      panchayath: agent.panchayath,
      ward: agent.ward,
      isExistingAgent: true,
      originalRole: agent.role
    };
    
    onAddMember(teamMember);
    toast({
      title: "Member added successfully",
      description: `${agent.name} has been added to the team`
    });
    onOpenChange(false);
  };

  const handleAddNewMember = () => {
    if (!newMember.name.trim() || !newMember.phoneNumber.trim() || !newMember.panchayath) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check if phone number already exists in agent hierarchy
    const existingAgent = agents.find(agent => agent.phoneNumber === newMember.phoneNumber);
    if (existingAgent) {
      toast({
        title: "Phone number exists",
        description: "This phone number already exists in the agent hierarchy. Please use the existing agents tab.",
        variant: "destructive"
      });
      return;
    }

    // Check if phone number already exists in team members
    const existingMember = existingMembers.find(member => member.phoneNumber === newMember.phoneNumber);
    if (existingMember) {
      toast({
        title: "Member already exists",
        description: "This member is already part of the team",
        variant: "destructive"
      });
      return;
    }

    const teamMember: TeamMember = {
      id: crypto.randomUUID(),
      name: newMember.name,
      phoneNumber: newMember.phoneNumber,
      role: "team member",
      panchayath: newMember.panchayath,
      ward: newMember.ward ? parseInt(newMember.ward) : undefined,
      isExistingAgent: false
    };
    
    onAddMember(teamMember);
    setNewMember({ name: "", phoneNumber: "", panchayath: "", ward: "" });
    toast({
      title: "New member added successfully",
      description: `${newMember.name} has been added to the team`
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add members to the team either from existing agents or create new team members
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Existing Agents
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              New Member
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or mobile number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {filteredAgents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No agents found matching your search" : "No available agents to add"}
                </div>
              ) : (
                filteredAgents.map((agent) => (
                  <Card key={agent.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{agent.name}</h4>
                          <p className="text-sm text-muted-foreground">{agent.phoneNumber}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{agent.role}</Badge>
                            <Badge variant="outline">{agent.panchayath}</Badge>
                            {agent.ward && <Badge variant="outline">Ward {agent.ward}</Badge>}
                          </div>
                        </div>
                        <Button onClick={() => handleAddExistingAgent(agent)}>
                          Add to Team
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Mobile Number *</Label>
                  <Input
                    id="phone"
                    value={newMember.phoneNumber}
                    onChange={(e) => setNewMember(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="panchayath">Panchayath *</Label>
                  <Select value={newMember.panchayath} onValueChange={(value) => setNewMember(prev => ({ ...prev, panchayath: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select panchayath" />
                    </SelectTrigger>
                    <SelectContent>
                      {panchayaths.map((panchayath) => (
                        <SelectItem key={panchayath} value={panchayath}>
                          {panchayath}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ward">Ward (Optional)</Label>
                  <Input
                    id="ward"
                    type="number"
                    value={newMember.ward}
                    onChange={(e) => setNewMember(prev => ({ ...prev, ward: e.target.value }))}
                    placeholder="Enter ward number"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNewMember}>
                  Add New Member
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberDialog;