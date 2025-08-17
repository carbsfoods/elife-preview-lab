import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Calendar as CalendarIcon, Edit, Trash2, CheckSquare, Clock, X, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import AgentSelector from "./AgentSelector";
import TeamSelector from "./TeamSelector";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "normal" | "medium" | "high";
  dueDate: Date;
  allocationType: "individual" | "team";
  assignedTo: string; // Agent ID or Team ID
  assignedToName: string; // Agent name or Team name
  status: "pending" | "completed" | "cancelled" | "expired";
  createdAt: string;
  completedAt?: string;
}

const TaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState("pending");
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "normal" as const,
    dueDate: undefined as Date | undefined,
    allocationType: "individual" as const,
    assignedTo: "",
    assignedToName: ""
  });

  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.dueDate || !newTask.assignedTo) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      allocationType: newTask.allocationType,
      assignedTo: newTask.assignedTo,
      assignedToName: newTask.assignedToName,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      priority: "normal",
      dueDate: undefined,
      allocationType: "individual",
      assignedTo: "",
      assignedToName: ""
    });
    setIsAddTaskOpen(false);
    toast({
      title: "Task created successfully",
      description: `Task "${task.title}" has been assigned to ${task.assignedToName}`
    });
  };

  const handleEditTask = () => {
    if (!editingTask) return;
    
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setIsEditTaskOpen(false);
    setEditingTask(null);
    toast({
      title: "Task updated successfully",
      description: "Task has been updated"
    });
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== taskId));
      toast({
        title: "Task deleted",
        description: "Task has been removed"
      });
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: newStatus,
            completedAt: newStatus === "completed" ? new Date().toISOString() : undefined
          }
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: "Task status updated",
        description: `Task "${task.title}" marked as ${newStatus}`
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckSquare className="h-4 w-4" />;
      case "cancelled": return <X className="h-4 w-4" />;
      case "expired": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => {
      if (status === "expired") {
        return task.status === "pending" && new Date(task.dueDate) < new Date();
      }
      return task.status === status;
    });
  };

  const renderTaskCard = (task: Task) => {
    const isExpired = task.status === "pending" && new Date(task.dueDate) < new Date();
    
    return (
      <Card key={task.id} className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{task.title}</CardTitle>
              <CardDescription className="mt-2">{task.description}</CardDescription>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingTask(task);
                  setIsEditTaskOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant={getPriorityColor(task.priority)}>
                {task.priority} priority
              </Badge>
              <Badge variant="outline">
                {task.allocationType === "individual" ? "Individual" : "Team"}
              </Badge>
              <Badge variant="outline">
                Due: {format(task.dueDate, "MMM dd, yyyy")}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium">Assigned to:</p>
              <p className="text-sm text-muted-foreground">{task.assignedToName}</p>
            </div>

            {task.status === "pending" && !isExpired && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(task.id, "completed")}
                >
                  <CheckSquare className="h-4 w-4 mr-1" />
                  Mark Complete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(task.id, "cancelled")}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Task Management</h2>
          <p className="text-muted-foreground">Create and manage individual and team tasks</p>
        </div>
        
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task and assign it to agents or teams
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="task-title">Title *</Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTask.priority} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Due Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newTask.dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTask.dueDate ? format(newTask.dueDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newTask.dueDate}
                        onSelect={(date) => setNewTask(prev => ({ ...prev, dueDate: date }))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="allocation-type">Allocation Type *</Label>
                <Select value={newTask.allocationType} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, allocationType: value, assignedTo: "", assignedToName: "" }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">To Individual Agent</SelectItem>
                    <SelectItem value="team">To Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newTask.allocationType === "individual" ? (
                <AgentSelector
                  selectedAgent={newTask.assignedTo}
                  onAgentSelect={(agentId, agentName) => {
                    setNewTask(prev => ({ ...prev, assignedTo: agentId, assignedToName: agentName }));
                  }}
                />
              ) : (
                <TeamSelector
                  selectedTeam={newTask.assignedTo}
                  onTeamSelect={(teamId, teamName) => {
                    setNewTask(prev => ({ ...prev, assignedTo: teamId, assignedToName: teamName }));
                  }}
                />
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>Create Task</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending ({getTasksByStatus("pending").filter(t => new Date(t.dueDate) >= new Date()).length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Completed ({getTasksByStatus("completed").length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Cancelled ({getTasksByStatus("cancelled").length})
          </TabsTrigger>
          <TabsTrigger value="expired" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Expired ({getTasksByStatus("expired").length})
          </TabsTrigger>
        </TabsList>

        {["pending", "completed", "cancelled", "expired"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getTasksByStatus(status).map(renderTaskCard)}
            </div>
            
            {getTasksByStatus(status).length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  {getStatusIcon(status)}
                  <h3 className="text-lg font-semibold">No {status} tasks</h3>
                  <p>Tasks marked as {status} will appear here</p>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Task Dialog */}
      <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task information
            </DialogDescription>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-task-title">Title</Label>
                <Input
                  id="edit-task-title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-task-description">Description</Label>
                <Textarea
                  id="edit-task-description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select value={editingTask.priority} onValueChange={(value: any) => setEditingTask(prev => prev ? { ...prev, priority: value } : null)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editingTask.dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingTask.dueDate ? format(editingTask.dueDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editingTask.dueDate}
                        onSelect={(date) => setEditingTask(prev => prev && date ? { ...prev, dueDate: date } : prev)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsEditTaskOpen(false);
                  setEditingTask(null);
                }}>
                  Cancel
                </Button>
                <Button onClick={handleEditTask}>Update Task</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManagement;