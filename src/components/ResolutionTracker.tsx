import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DailyUpdate } from "@/types/database";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface ResolutionTrackerProps {
  resolutionId: string;
}

const ResolutionTracker = ({ resolutionId }: ResolutionTrackerProps) => {
  const { toast } = useToast();
  const [updates, setUpdates] = useState<DailyUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, [resolutionId]);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from("daily_updates")
        .select("*")
        .eq("resolution_id", resolutionId)
        .order("date", { ascending: true });

      if (error) throw error;
      if (data) setUpdates(data);
    } catch (error) {
      console.error("Error fetching updates:", error);
      toast({
        title: "Error",
        description: "Failed to load progress data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markToday = async (completed: boolean) => {
    if (updating) return;
    setUpdating(true);
    
    const today = new Date().toISOString().split("T")[0];
    
    try {
      const { error } = await supabase
        .from("daily_updates")
        .upsert({
          resolution_id: resolutionId,
          date: today,
          completed,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Day marked as ${completed ? 'complete' : 'incomplete'}.`,
      });

      await fetchUpdates();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const todayUpdate = updates.find(update => update.date === today);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-xl font-bold">Today's Progress</h3>
          {!todayUpdate ? (
            <div className="flex gap-4">
              <Button
                onClick={() => markToday(true)}
                disabled={updating}
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Complete
              </Button>
              <Button
                onClick={() => markToday(false)}
                disabled={updating}
                className="bg-red-500 hover:bg-red-600"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Mark as Incomplete
              </Button>
            </div>
          ) : (
            <div className={`text-lg font-medium ${todayUpdate.completed ? 'text-green-500' : 'text-red-500'}`}>
              {todayUpdate.completed ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Completed
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Incomplete
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Year Progress</h3>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 365 }).map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() - (364 - index));
              const dateStr = date.toISOString().split("T")[0];
              const update = updates.find(u => u.date === dateStr);
              
              return (
                <div
                  key={index}
                  className={`
                    w-full pt-[100%] relative rounded-sm cursor-help
                    ${update ? (update.completed ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-200'}
                  `}
                  title={`${dateStr}${update ? (update.completed ? ' - Completed' : ' - Incomplete') : ' - No update'}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResolutionTracker;