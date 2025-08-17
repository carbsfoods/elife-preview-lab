import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

interface TeamSelectorProps {
  selectedTeam: string;
  onTeamSelect: (teamId: string, teamName: string) => void;
}

const TeamSelector = ({ selectedTeam, onTeamSelect }: TeamSelectorProps) => {
  // Mock data for teams - In real app, this would come from the database/context
  const [teams] = useState<Team[]>([
    { id: "1", name: "Development Team", description: "Frontend and backend developers", memberCount: 5 },
    { id: "2", name: "Marketing Team", description: "Digital marketing specialists", memberCount: 3 },
    { id: "3", name: "Support Team", description: "Customer support representatives", memberCount: 4 },
    { id: "4", name: "Quality Assurance", description: "QA and testing specialists", memberCount: 2 },
  ]);

  const selectedTeamData = teams.find(team => team.id === selectedTeam);

  return (
    <div className="space-y-3">
      <Label>Assign to Team *</Label>
      
      {selectedTeamData ? (
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {selectedTeamData.name}
                </h4>
                <p className="text-sm text-muted-foreground">{selectedTeamData.description}</p>
                <Badge variant="outline" className="mt-2">
                  {selectedTeamData.memberCount} members
                </Badge>
              </div>
              <Button
                variant="outline"
                onClick={() => onTeamSelect("", "")}
              >
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Select value={selectedTeam} onValueChange={(value) => {
          const team = teams.find(t => t.id === value);
          if (team) {
            onTeamSelect(team.id, team.name);
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select a team to assign the task" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{team.name}</div>
                    <div className="text-sm text-muted-foreground">{team.memberCount} members</div>
                  </div>
                </div>
              </SelectItem>
            ))}
            {teams.length === 0 && (
              <SelectItem value="no-teams" disabled>
                No teams available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default TeamSelector;