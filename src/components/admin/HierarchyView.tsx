import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Minimize2, Maximize2 } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: 'coordinator' | 'supervisor' | 'group_leader' | 'pro';
  superior_id?: string;
  phone_number: string;
  ward?: number;
  subordinates?: Agent[];
}

interface Panchayath {
  id: string;
  name: string;
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

const HierarchyNode = ({ agent, level = 0, onExpand }: { agent: Agent; level?: number; onExpand: (id: string) => void }) => {
  const [expanded, setExpanded] = useState(level < 2);

  const handleToggle = () => {
    setExpanded(!expanded);
    onExpand(agent.id);
  };

  return (
    <div className="ml-4" style={{ marginLeft: `${level * 20}px` }}>
      <div className="flex items-center space-x-2 py-2 border-l-2 border-border pl-4">
        {agent.subordinates && agent.subordinates.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="p-1 h-6 w-6"
          >
            {expanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
        )}
        <div className="flex items-center space-x-2">
          <span className="font-medium">{agent.name}</span>
          <Badge variant={roleBadgeVariants[agent.role]} className="text-xs">
            {roleLabels[agent.role]}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-6 w-6"
            onClick={() => alert(`Agent Details:\nName: ${agent.name}\nRole: ${roleLabels[agent.role]}\nPhone: ${agent.phone_number}\nWard: ${agent.ward || 'N/A'}`)}
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {expanded && agent.subordinates && (
        <div className="ml-4">
          {agent.subordinates.map((subordinate) => (
            <HierarchyNode
              key={subordinate.id}
              agent={subordinate}
              level={level + 1}
              onExpand={onExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const HierarchyView = () => {
  const [panchayaths, setPanchayaths] = useState<Panchayath[]>([]);
  const [selectedPanchayath, setSelectedPanchayath] = useState<string>("");
  const [hierarchyData, setHierarchyData] = useState<Agent[]>([]);
  const [tableData, setTableData] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPanchayaths = async () => {
    try {
      const { data, error } = await supabase
        .from("panchayaths")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setPanchayaths(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch panchayaths",
        variant: "destructive",
      });
    }
  };

  const fetchHierarchyData = async (panchayathId: string) => {
    if (!panchayathId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("panchayath_id", panchayathId)
        .order("role");

      if (error) throw error;

      const agents = data || [];
      setTableData(agents);

      // Build hierarchy structure
      const agentMap = new Map(agents.map(agent => [agent.id, { ...agent, subordinates: [] }]));
      const roots: Agent[] = [];

      agents.forEach(agent => {
        const agentWithSubordinates = agentMap.get(agent.id)!;
        if (agent.superior_id && agentMap.has(agent.superior_id)) {
          const superior = agentMap.get(agent.superior_id)!;
          superior.subordinates!.push(agentWithSubordinates);
        } else {
          roots.push(agentWithSubordinates);
        }
      });

      setHierarchyData(roots);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch hierarchy data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPanchayaths();
  }, []);

  useEffect(() => {
    if (selectedPanchayath) {
      fetchHierarchyData(selectedPanchayath);
    }
  }, [selectedPanchayath]);

  const filteredTableData = tableData.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.phone_number.includes(searchTerm) ||
    roleLabels[agent.role].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExpand = (agentId: string) => {
    // Handle expand/collapse logic if needed
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hierarchy View</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Select value={selectedPanchayath} onValueChange={setSelectedPanchayath}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a panchayath to view hierarchy" />
                </SelectTrigger>
                <SelectContent>
                  {panchayaths.map((panchayath) => (
                    <SelectItem key={panchayath.id} value={panchayath.id}>
                      {panchayath.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedPanchayath ? (
            <div className="text-center py-8 text-muted-foreground">
              Please select a panchayath to view its hierarchy
            </div>
          ) : loading ? (
            <div className="text-center py-8">Loading hierarchy...</div>
          ) : (
            <Tabs defaultValue="chart" className="w-full">
              <TabsList>
                <TabsTrigger value="chart">Chart View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="mt-6">
                <div className="border rounded-lg p-4 bg-muted/20">
                  {hierarchyData.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No agents found for this panchayath
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="font-semibold text-lg mb-4">Organization Hierarchy</div>
                      {hierarchyData.map((agent) => (
                        <HierarchyNode 
                          key={agent.id} 
                          agent={agent} 
                          onExpand={handleExpand}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="table" className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Ward</TableHead>
                      <TableHead>Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTableData.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell className="font-medium">{agent.name}</TableCell>
                        <TableCell>
                          <Badge variant={roleBadgeVariants[agent.role]}>
                            {roleLabels[agent.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>{agent.phone_number}</TableCell>
                        <TableCell>{agent.ward || '-'}</TableCell>
                        <TableCell>
                          {agent.role === 'coordinator' ? 'Level 1' :
                           agent.role === 'supervisor' ? 'Level 2' :
                           agent.role === 'group_leader' ? 'Level 3' : 'Level 4'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredTableData.length === 0 && searchTerm && (
                  <div className="text-center py-4 text-muted-foreground">
                    No agents found matching "{searchTerm}"
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HierarchyView;