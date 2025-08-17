import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CheckPoints = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Check Points</h1>
          <p className="text-muted-foreground mt-2">Check agent points based on daily activities</p>
        </div>
        
        <div className="grid gap-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Agent Points Overview</h2>
            <p className="text-muted-foreground">Check points functionality will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckPoints;