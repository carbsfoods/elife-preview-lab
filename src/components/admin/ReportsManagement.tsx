import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Users, 
  UserX, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  Star,
  Target,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PointsSystem {
  id: string;
  role: string;
  daily_points: number;
  bonus_points_allowed: boolean;
}

const ReportsManagement = () => {
  const { toast } = useToast();
  const [pointsSystem, setPointsSystem] = useState<PointsSystem[]>([
    { id: "1", role: "coordinator", daily_points: 100, bonus_points_allowed: true },
    { id: "2", role: "supervisor", daily_points: 75, bonus_points_allowed: true },
    { id: "3", role: "group_leader", daily_points: 50, bonus_points_allowed: true },
    { id: "4", role: "pro", daily_points: 25, bonus_points_allowed: true },
  ]);

  // Mock data for reports
  const agentReports = {
    leaves: [
      { name: "Ravi Kumar", role: "supervisor", days: 3, status: "On Leave" },
      { name: "Priya Nair", role: "group_leader", days: 4, status: "On Leave" },
    ],
    inactive: [
      { name: "Suresh Menon", role: "pro", days: 12, lastActive: "2024-01-05" },
      { name: "Lakshmi Devi", role: "pro", days: 15, lastActive: "2024-01-02" },
    ],
    superPerformers: [
      { name: "Anitha Jose", role: "coordinator", streak: 45, points: 4500 },
      { name: "Rajesh Pillai", role: "supervisor", streak: 30, points: 2250 },
    ],
    panchayathPerformance: {
      totalAgents: 124,
      activeAgents: 98,
      onLeave: 12,
      inactive: 14,
      percentage: 79
    }
  };

  const updatePoints = (id: string, points: number) => {
    setPointsSystem(prev => 
      prev.map(item => 
        item.id === id ? { ...item, daily_points: points } : item
      )
    );
    toast({
      title: "Points Updated",
      description: "Daily points have been updated successfully.",
    });
  };

  const toggleBonus = (id: string) => {
    setPointsSystem(prev => 
      prev.map(item => 
        item.id === id ? { ...item, bonus_points_allowed: !item.bonus_points_allowed } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="agent-performance" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="agent-performance">Agent Performance</TabsTrigger>
          <TabsTrigger value="team-performance">Team Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="agent-performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Leave Reports */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                <Calendar className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{agentReports.leaves.length}</div>
                <p className="text-xs text-muted-foreground">
                  3+ consecutive absences
                </p>
              </CardContent>
            </Card>

            {/* Inactive Agents */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                <UserX className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{agentReports.inactive.length}</div>
                <p className="text-xs text-muted-foreground">
                  10+ days no activity
                </p>
              </CardContent>
            </Card>

            {/* Super Performers */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Super Performers</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">{agentReports.superPerformers.length}</div>
                <p className="text-xs text-muted-foreground">
                  No absences recorded
                </p>
              </CardContent>
            </Card>

            {/* Panchayath Performance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {agentReports.panchayathPerformance.percentage}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {agentReports.panchayathPerformance.activeAgents}/{agentReports.panchayathPerformance.totalAgents} active
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leave Reports Detail */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Leave Reports
                </CardTitle>
                <CardDescription>Agents with 3+ consecutive absences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agentReports.leaves.map((agent, idx) => (
                    <div key={idx} className="flex items-center justify-between border-l-4 border-l-orange-500 pl-3">
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{agent.role.replace('_', ' ')}</p>
                      </div>
                      <Badge variant="destructive">{agent.days} days</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Inactive Agents Detail */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserX className="h-5 w-5 text-red-500" />
                  Inactive Agents
                </CardTitle>
                <CardDescription>Agents with 10+ days no activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agentReports.inactive.map((agent, idx) => (
                    <div key={idx} className="flex items-center justify-between border-l-4 border-l-red-500 pl-3">
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">Last: {agent.lastActive}</p>
                      </div>
                      <Badge variant="destructive">{agent.days} days</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Super Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Super Performers
                </CardTitle>
                <CardDescription>Agents with perfect attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agentReports.superPerformers.map((agent, idx) => (
                    <div key={idx} className="flex items-center justify-between border-l-4 border-l-yellow-500 pl-3">
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">{agent.streak} day streak</p>
                      </div>
                      <Badge className="bg-yellow-500">{agent.points} pts</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Points System Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Daily Points System
                </CardTitle>
                <CardDescription>Manage points for each role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pointsSystem.map((system) => (
                    <div key={system.id} className="space-y-2 border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <Label className="capitalize font-medium">
                          {system.role.replace('_', ' ')}
                        </Label>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={system.daily_points}
                          onChange={(e) => updatePoints(system.id, parseInt(e.target.value))}
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">points/day</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={system.bonus_points_allowed}
                          onCheckedChange={() => toggleBonus(system.id)}
                        />
                        <Label className="text-sm">Allow bonus points</Label>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Role
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team-performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Tasks</CardTitle>
                <Target className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  Active team tasks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">87%</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Speed</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3</div>
                <p className="text-xs text-muted-foreground">
                  Days per task
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Team Task Performance</CardTitle>
              <CardDescription>Completion speed and ratio by team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-muted-foreground py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Team performance tracking will be implemented here.</p>
                  <p className="text-sm">Track task completion speed and team ratios.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManagement;