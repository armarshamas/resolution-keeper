import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DailyUpdate } from "@/types/database";

interface ResolutionTrackerProps {
  resolutionId: string;
}

const ResolutionTracker = ({ resolutionId }: ResolutionTrackerProps) => {
  const { toast } = useToast();
  const [updates, setUpdates] = useState<DailyUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, [resolutionId]);

  const fetchUpdates = async () => {
    const { data, error } = await supabase
      .from("daily_updates")
      .select("*")
      .eq("resolution_id", resolutionId)
      .order("date", { ascending: true });

    if (!error && data) {
      setUpdates(data);
    }
    setLoading(false);
  };

  const markToday = async (completed: boolean) => {
    const today = new Date().toISOString().split("T")[0];
    
    const { error } = await supabase
      .from("daily_updates")
      .upsert({
        resolution_id: resolutionId,
        date: today,
        completed,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Your progress has been updated.",
    });

    fetchUpdates();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const today = new Date().toISOString().split("T")[0];
  const todayUpdate = updates.find(update => update.date === today);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Daily Progress</h3>
      
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-2">Today's Status</h4>
        {!todayUpdate ? (
          <div className="space-x-4">
            <Button
              onClick={() => markToday(true)}
              className="bg-green-500 hover:bg-green-600"
            >
              Mark as Complete
            </Button>
            <Button
              onClick={() => markToday(false)}
              className="bg-red-500 hover:bg-red-600"
            >
              Mark as Incomplete
            </Button>
          </div>
        ) : (
          <div className={`text-lg font-medium ${todayUpdate.completed ? 'text-green-500' : 'text-red-500'}`}>
            {todayUpdate.completed ? 'Completed' : 'Incomplete'}
          </div>
        )}
      </div>

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
                w-full pt-[100%] relative rounded-sm
                ${update ? (update.completed ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-200'}
              `}
              title={dateStr}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ResolutionTracker;