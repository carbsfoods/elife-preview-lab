import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Upload, FileSpreadsheet } from "lucide-react";

interface Panchayath {
  id: string;
  name: string;
  district: string;
  number_of_wards: number;
  hierarchy_file_url?: string;
  created_at: string;
}

interface PanchayathFormData {
  name: string;
  district: string;
  number_of_wards: number;
}

const PanchayathManagement = () => {
  const [panchayaths, setPanchayaths] = useState<Panchayath[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPanchayath, setEditingPanchayath] = useState<Panchayath | null>(null);
  const { toast } = useToast();

  const form = useForm<PanchayathFormData>({
    defaultValues: {
      name: "",
      district: "",
      number_of_wards: 1,
    },
  });

  const fetchPanchayaths = async () => {
    try {
      const { data, error } = await supabase
        .from("panchayaths")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPanchayaths(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch panchayaths",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPanchayaths();
  }, []);

  const onSubmit = async (data: PanchayathFormData) => {
    try {
      if (editingPanchayath) {
        const { error } = await supabase
          .from("panchayaths")
          .update(data)
          .eq("id", editingPanchayath.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Panchayath updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("panchayaths")
          .insert([data]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Panchayath added successfully",
        });
      }

      setDialogOpen(false);
      setEditingPanchayath(null);
      form.reset();
      fetchPanchayaths();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save panchayath",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (panchayath: Panchayath) => {
    setEditingPanchayath(panchayath);
    form.reset({
      name: panchayath.name,
      district: panchayath.district,
      number_of_wards: panchayath.number_of_wards,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this panchayath?")) return;

    try {
      const { error } = await supabase
        .from("panchayaths")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Panchayath deleted successfully",
      });
      fetchPanchayaths();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete panchayath",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (panchayathId: string) => {
    // File upload logic will be implemented here
    toast({
      title: "Info",
      description: "File upload functionality will be implemented",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Panchayath Management</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingPanchayath(null);
                    form.reset();
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Panchayath
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingPanchayath ? "Edit Panchayath" : "Add New Panchayath"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Panchayath Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter panchayath name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter district name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="number_of_wards"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Wards</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="Enter number of wards"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingPanchayath ? "Update" : "Add"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
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
                  <TableHead>District</TableHead>
                  <TableHead>Wards</TableHead>
                  <TableHead>Hierarchy File</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {panchayaths.map((panchayath) => (
                  <TableRow key={panchayath.id}>
                    <TableCell className="font-medium">{panchayath.name}</TableCell>
                    <TableCell>{panchayath.district}</TableCell>
                    <TableCell>{panchayath.number_of_wards}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {panchayath.hierarchy_file_url ? (
                          <Button variant="outline" size="sm">
                            <FileSpreadsheet className="mr-1 h-3 w-3" />
                            View File
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">No file</span>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFileUpload(panchayath.id)}
                        >
                          <Upload className="mr-1 h-3 w-3" />
                          Upload
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(panchayath)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(panchayath.id)}
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

export default PanchayathManagement;