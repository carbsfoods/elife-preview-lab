import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Users, UserPlus, UserMinus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamMemberDialog from "./TeamMemberDialog";

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: string;
}

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

const TeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: ""
  });

  const handleAddTeam = () => {
    if (!newTeam.name.trim()) return;
    
    const team: Team = {
      id: crypto.randomUUID(),
      name: newTeam.name,
      description: newTeam.description,
      members: [],
      createdAt: new Date().toISOString()
    };
    
    setTeams([...teams, team]);
    setNewTeam({ name: "", description: "" });
    setIsAddTeamOpen(false);
  };

  const handleEditTeam = () => {
    if (!editingTeam || !editingTeam.name.trim()) return;
    
    setTeams(teams.map(team => 
      team.id === editingTeam.id 
        ? { ...editingTeam }
        : team
    ));
    setIsEditTeamOpen(false);
    setEditingTeam(null);
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm("Are you sure you want to delete this team?")) {
      setTeams(teams.filter(team => team.id !== teamId));
    }
  };

  const handleAddMember = (member: TeamMember) => {
    if (!selectedTeam) return;
    
    setTeams(teams.map(team => 
      team.id === selectedTeam.id 
        ? { ...team, members: [...team.members, member] }
        : team
    ));
    
    // Update selectedTeam to reflect the new member
    setSelectedTeam(prev => prev ? {
      ...prev,
      members: [...prev.members, member]
    } : null);
  };

  const handleRemoveMember = (teamId: string, memberId: string) => {
    if (confirm("Are you sure you want to remove this member from the team?")) {
      setTeams(teams.map(team => 
        team.id === teamId 
          ? { ...team, members: team.members.filter(member => member.id !== memberId) }
          : team
      ));
      
      // Update selectedTeam if it's the current team being modified
      if (selectedTeam?.id === teamId) {
        setSelectedTeam(prev => prev ? {
          ...prev,
          members: prev.members.filter(member => member.id !== memberId)
        } : null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Team Management</h2>
          <p className="text-muted-foreground">Create and manage teams and their members</p>
        </div>
        
        <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team</DialogTitle>
              <DialogDescription>
                Create a new team with name and description
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <Label htmlFor="team-description">Description</Label>
                <Textarea
                  id="team-description"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter team description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddTeamOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTeam}>Add Team</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {team.name}
                  </CardTitle>
                  <CardDescription>{team.description}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingTeam(team);
                      setIsEditTeamOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTeam(team.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {team.members.length} members
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTeam(team);
                      setIsAddMemberOpen(true);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add Member
                  </Button>
                </div>
                
                {team.members.length > 0 && (
                  <div className="space-y-2">
                    {team.members.slice(0, 3).map((member) => (
                      <div key={member.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-muted-foreground">{member.phoneNumber}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(team.id, member.id)}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {team.members.length > 3 && (
                      <p className="text-sm text-muted-foreground">
                        +{team.members.length - 3} more members
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teams.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No teams created yet</h3>
            <p className="text-muted-foreground mb-4">Start by creating your first team</p>
            <Button onClick={() => setIsAddTeamOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Team Dialog */}
      <Dialog open={isEditTeamOpen} onOpenChange={setIsEditTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>
              Update team information
            </DialogDescription>
          </DialogHeader>
          {editingTeam && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-team-name">Team Name</Label>
                <Input
                  id="edit-team-name"
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <Label htmlFor="edit-team-description">Description</Label>
                <Textarea
                  id="edit-team-description"
                  value={editingTeam.description}
                  onChange={(e) => setEditingTeam(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Enter team description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsEditTeamOpen(false);
                  setEditingTeam(null);
                }}>
                  Cancel
                </Button>
                <Button onClick={handleEditTeam}>Update Team</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Team Member Dialog */}
      <TeamMemberDialog
        isOpen={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        onAddMember={handleAddMember}
        existingMembers={selectedTeam?.members || []}
      />
    </div>
  );
};

export default TeamManagement;