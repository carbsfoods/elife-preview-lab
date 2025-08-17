import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Download } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  panchayath_id: string;
  role: 'coordinator' | 'supervisor' | 'group_leader' | 'pro';
  superior_id?: string;
  phone_number: string;
  ward?: number;
  panchayaths: {
    name: string;
  };
  superior?: {
    name: string;
  };
}

interface Panchayath {
  id: string;
  name: string;
}

interface AgentFormData {
  name: string;
  panchayath_id: string;
  role: 'coordinator' | 'supervisor' | 'group_leader' | 'pro';
  superior_id?: string;
  phone_number: string;
  ward?: number;
}

const roleLabels = {
  coordinator: 'Coordinator',
  supervisor: 'Supervisor',
  group_leader: 'Group Leader',
  pro: 'P.R.O',
};

const roleBadgeVariants = {
  coordinator: 'default',
  supervisor: 'secondary',
  group_leader: 'outline',
  pro: 'destructive',
} as const;

interface PotentialSuperior {
  id: string;
  name: string;
  role: 'coordinator' | 'supervisor' | 'group_leader' | 'pro';
}

const AgentManagement = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [panchayaths, setPanchayaths] = useState<Panchayath[]>([]);
  const [potentialSuperiors, setPotentialSuperiors] = useState<PotentialSuperior[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const { toast } = useToast();

  const form = useForm<AgentFormData>({
    defaultValues: {
      name: "",
      panchayath_id: "",
      role: "pro",
      phone_number: "",
    },
  });

  const selectedPanchayathId = form.watch("panchayath_id");
  const selectedRole = form.watch("role");

  const fetchData = async () => {
    try {
      // Fetch panchayaths
      const { data: panchayathData, error: panchayathError } = await supabase
        .from("panchayaths")
        .select("id, name")
        .order("name");

      if (panchayathError) throw panchayathError;
      setPanchayaths(panchayathData || []);

      // Fetch agents with relationships
      const { data: agentData, error: agentError } = await supabase
        .from("agents")
        .select(`
          *,
          panchayaths(name),
          superior:agents!superior_id(name)
        `)
        .order("created_at", { ascending: false });

      if (agentError) throw agentError;
      setAgents(agentData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPotentialSuperiors = async (panchayathId: string, role: string) => {
    if (!panchayathId || role === 'coordinator') {
      setPotentialSuperiors([]);
      return;
    }

    try {
      let superiorRole: 'coordinator' | 'supervisor' | 'group_leader' | 'pro';
      switch (role) {
        case 'supervisor':
          superiorRole = 'coordinator';
          break;
        case 'group_leader':
          superiorRole = 'supervisor';
          break;
        case 'pro':
          superiorRole = 'group_leader';
          break;
        default:
          return;
      }

      const { data, error } = await supabase
        .from("agents")
        .select("id, name, role")
        .eq("panchayath_id", panchayathId)
        .eq("role", superiorRole);

      if (error) throw error;
      setPotentialSuperiors(data || []);
    } catch (error) {
      console.error("Error fetching potential superiors:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPanchayathId && selectedRole) {
      fetchPotentialSuperiors(selectedPanchayathId, selectedRole);
    }
  }, [selectedPanchayathId, selectedRole]);

  const onSubmit = async (data: AgentFormData) => {
    try {
      const agentData = {
        ...data,
        ward: data.ward || null,
        superior_id: data.superior_id || null,
      };

      if (editingAgent) {
        const { error } = await supabase
          .from("agents")
          .update(agentData)
          .eq("id", editingAgent.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Agent updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("agents")
          .insert([agentData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Agent added successfully",
        });
      }

      setDialogOpen(false);
      setEditingAgent(null);
      form.reset();
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save agent",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    form.reset({
      name: agent.name,
      panchayath_id: agent.panchayath_id,
      role: agent.role,
      superior_id: agent.superior_id || "",
      phone_number: agent.phone_number,
      ward: agent.ward || undefined,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;

    try {
      const { error } = await supabase
        .from("agents")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    }
  };

  const downloadSampleFile = () => {
    toast({
      title: "Info",
      description: "Sample file download will be implemented",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Agent Management</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={downloadSampleFile}>
                <Download className="mr-2 h-4 w-4" />
                Download Sample
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingAgent(null);
                      form.reset({
                        name: "",
                        panchayath_id: "",
                        role: "pro",
                        phone_number: "",
                      });
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Agent
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAgent ? "Edit Agent" : "Add New Agent"}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Agent Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter agent name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="panchayath_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Panchayath</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select panchayath" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {panchayaths.map((panchayath) => (
                                      <SelectItem key={panchayath.id} value={panchayath.id}>
                                        {panchayath.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="coordinator">Coordinator</SelectItem>
                                    <SelectItem value="supervisor">Supervisor</SelectItem>
                                    <SelectItem value="group_leader">Group Leader</SelectItem>
                                    <SelectItem value="pro">P.R.O</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {selectedRole !== 'coordinator' && (
                          <FormField
                            control={form.control}
                            name="superior_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Superior</FormLabel>
                                <FormControl>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    value={field.value}
                                    disabled={potentialSuperiors.length === 0}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select superior" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {potentialSuperiors.map((superior) => (
                                        <SelectItem key={superior.id} value={superior.id}>
                                          {superior.name} ({roleLabels[superior.role]})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        <FormField
                          control={form.control}
                          name="ward"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ward (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  placeholder="Enter ward number"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingAgent ? "Update" : "Add"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Panchayath</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Superior</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{agent.panchayaths?.name}</TableCell>
                    <TableCell>
                      <Badge variant={roleBadgeVariants[agent.role]}>
                        {roleLabels[agent.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {agent.superior?.name || 'Administration COD'}
                    </TableCell>
                    <TableCell>{agent.phone_number}</TableCell>
                    <TableCell>{agent.ward || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(agent)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(agent.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentManagement;