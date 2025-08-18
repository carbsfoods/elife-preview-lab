import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar as CalendarIcon, Save, Trophy, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, isToday, startOfDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DailyNote {
  id: string;
  note_date: string;
  description: string;
  points_earned: number;
}

const DailyNotes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  // Mock agent ID - in real app this would come from authentication
  const agentId = "mock-agent-id";

  useEffect(() => {
    fetchNotes();
    fetchTotalPoints();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("daily_notes")
        .select("*")
        .eq("agent_id", agentId)
        .order("note_date", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchTotalPoints = async () => {
    try {
      const { data, error } = await supabase
        .from("daily_notes")
        .select("points_earned")
        .eq("agent_id", agentId);

      if (error) throw error;
      const total = data?.reduce((sum, note) => sum + (note.points_earned || 0), 0) || 0;
      setTotalPoints(total);
    } catch (error) {
      console.error("Error fetching points:", error);
    }
  };

  const getCurrentDateNote = () => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return notes.find(note => note.note_date === dateStr);
  };

  const saveNote = async () => {
    if (!currentNote.trim()) {
      toast({
        title: "Error",
        description: "Please enter a note description",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const existingNote = getCurrentDateNote();

      // Get points for role (mock data - in real app get from points_system table)
      const rolePoints = 50;

      if (existingNote) {
        const { error } = await supabase
          .from("daily_notes")
          .update({ 
            description: currentNote,
            points_earned: rolePoints
          })
          .eq("id", existingNote.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("daily_notes")
          .insert({
            agent_id: agentId,
            note_date: dateStr,
            description: currentNote,
            points_earned: rolePoints
          });

        if (error) throw error;
      }

      await fetchNotes();
      await fetchTotalPoints();
      setCurrentNote("");
      
      // Show congratulations popup
      toast({
        title: "🎉 Congratulations!",
        description: `You earned ${rolePoints} points for today's update!`,
        duration: 5000,
      });

    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isDateAbsent = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const hasNote = notes.some(note => note.note_date === dateStr);
    const isPastDate = date < startOfDay(new Date());
    return isPastDate && !hasNote;
  };

  const getDateStatus = (date: Date) => {
    if (isDateAbsent(date)) return "absent";
    if (notes.some(note => note.note_date === format(date, "yyyy-MM-dd"))) return "present";
    return "default";
  };

  useEffect(() => {
    const existingNote = getCurrentDateNote();
    setCurrentNote(existingNote?.description || "");
  }, [selectedDate, notes]);

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">ഡെയിലി നോട്ട്</h1>
              <p className="text-muted-foreground mt-2">Log and track daily activities</p>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-semibold">{totalPoints} Points</span>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Note Entry Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(selectedDate, "MMMM d, yyyy")}
                {!isToday(selectedDate) && (
                  <Badge variant={isDateAbsent(selectedDate) ? "destructive" : "default"}>
                    {isDateAbsent(selectedDate) ? "Absent" : "Logged"}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your daily activities and notes..."
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                className="min-h-[120px]"
                disabled={!isToday(selectedDate)}
              />
              
              {!isToday(selectedDate) && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">You can only edit today's note</span>
                </div>
              )}
              
              <Button 
                onClick={saveNote} 
                disabled={loading || !isToday(selectedDate) || !currentNote.trim()}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save Note"}
              </Button>
            </CardContent>
          </Card>

          {/* Calendar Section */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                modifiers={{
                  absent: (date) => isDateAbsent(date),
                  present: (date) => notes.some(note => note.note_date === format(date, "yyyy-MM-dd"))
                }}
                modifiersStyles={{
                  absent: { backgroundColor: "rgb(239 68 68)", color: "white" },
                  present: { backgroundColor: "rgb(34 197 94)", color: "white" }
                }}
              />
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm">Notes logged</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm">Absent days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes History */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notes.slice(0, 5).map((note) => (
                <div key={note.id} className="border-l-4 border-l-primary pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{format(new Date(note.note_date), "MMM d, yyyy")}</span>
                    <Badge variant="secondary">+{note.points_earned} pts</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{note.description}</p>
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No notes yet. Start logging your daily activities!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyNotes;