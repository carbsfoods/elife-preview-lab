import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Trash2,
  Building2,
  BarChart3
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
  const [selectedPanchayath, setSelectedPanchayath] = useState<string>("");
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [pointsSystem, setPointsSystem] = useState<PointsSystem[]>([
    { id: "1", role: "coordinator", daily_points: 100, bonus_points_allowed: true },
    { id: "2", role: "supervisor", daily_points: 75, bonus_points_allowed: true },
    { id: "3", role: "group_leader", daily_points: 50, bonus_points_allowed: true },
    { id: "4", role: "pro", daily_points: 25, bonus_points_allowed: true },
  ]);

  // Mock panchayaths data
  const panchayaths = [
    { id: "1", name: "Thiruvananthapuram", district: "Thiruvananthapuram" },
    { id: "2", name: "Kollam", district: "Kollam" },
    { id: "3", name: "Pathanamthitta", district: "Pathanamthitta" },
    { id: "4", name: "Alappuzha", district: "Alappuzha" },
  ];

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

  const handleCardClick = (cardType: string) => {
    setActiveCard(activeCard === cardType ? null : cardType);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="area-report" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="area-report">Area Report</TabsTrigger>
          <TabsTrigger value="panchayath-report">Panchayath Report</TabsTrigger>
        </TabsList>

        <TabsContent value="area-report" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team Performance Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => handleCardClick('team-performance')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-500" />
                  Team Performance
                </CardTitle>
                <CardDescription>View team task completion rates and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-500">24</div>
                    <p className="text-xs text-muted-foreground">Active Tasks</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">87%</div>
                    <p className="text-xs text-muted-foreground">Completion</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-500">2.3</div>
                    <p className="text-xs text-muted-foreground">Avg Days</p>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </CardContent>
            </Card>

            {/* Daily Points System Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => handleCardClick('points-system')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-green-500" />
                  Daily Points System
                </CardTitle>
                <CardDescription>Manage points allocation for different roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pointsSystem.map((system) => (
                    <div key={system.id} className="flex justify-between items-center text-sm">
                      <span className="capitalize">{system.role.replace('_', ' ')}</span>
                      <span className="font-medium">{system.daily_points} pts</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">
                  <Edit className="mr-2 h-4 w-4" />
                  Manage Points
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Expanded Views */}
          {activeCard === 'team-performance' && (
            <Card>
              <CardHeader>
                <CardTitle>Team Performance Dashboard</CardTitle>
                <CardDescription>Detailed analytics for team task management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Active Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-500">24</div>
                      <p className="text-sm text-muted-foreground">Currently in progress</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-500">87%</div>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Average Speed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-500">2.3</div>
                      <p className="text-sm text-muted-foreground">Days per task</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="text-center text-muted-foreground py-8">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Detailed team performance charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeCard === 'points-system' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Daily Points System Management
                </CardTitle>
                <CardDescription>Configure point allocation for each role</CardDescription>
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
          )}
        </TabsContent>

        <TabsContent value="panchayath-report" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                Select Panchayath
              </CardTitle>
              <CardDescription>Choose a panchayath to view agent performance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedPanchayath} onValueChange={setSelectedPanchayath}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a panchayath..." />
                </SelectTrigger>
                <SelectContent>
                  {panchayaths.map((panchayath) => (
                    <SelectItem key={panchayath.id} value={panchayath.id}>
                      {panchayath.name} - {panchayath.district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedPanchayath && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Agent Performance Cards - Clickable */}
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => handleCardClick('on-leave')}
                >
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

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => handleCardClick('inactive')}
                >
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

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => handleCardClick('super-performers')}
                >
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

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => handleCardClick('performance')}
                >
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

              {/* Detailed Views for Selected Cards */}
              {activeCard === 'on-leave' && (
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
              )}

              {activeCard === 'inactive' && (
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
              )}

              {activeCard === 'super-performers' && (
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
              )}

              {activeCard === 'performance' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Overall Performance
                    </CardTitle>
                    <CardDescription>Panchayath performance breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{agentReports.panchayathPerformance.totalAgents}</div>
                        <p className="text-sm text-muted-foreground">Total Agents</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{agentReports.panchayathPerformance.activeAgents}</div>
                        <p className="text-sm text-muted-foreground">Active</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500">{agentReports.panchayathPerformance.onLeave}</div>
                        <p className="text-sm text-muted-foreground">On Leave</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">{agentReports.panchayathPerformance.inactive}</div>
                        <p className="text-sm text-muted-foreground">Inactive</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManagement;