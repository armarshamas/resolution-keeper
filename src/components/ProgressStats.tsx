import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Resolution, DailyUpdate } from "@/types/database";

interface ProgressStatsProps {
  resolution: Resolution;
}

const ProgressStats = ({ resolution }: ProgressStatsProps) => {
  const [stats, setStats] = useState({
    successDays: 0,
    failedDays: 0,
    remainingDays: 365,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("daily_updates")
        .select("*")
        .eq("resolution_id", resolution.id);

      if (!error && data) {
        const successDays = data.filter(d => d.completed).length;
        const failedDays = data.filter(d => !d.completed).length;
        const remainingDays = 365 - (successDays + failedDays);

        setStats({ successDays, failedDays, remainingDays });
      }
    };

    fetchStats();
  }, [resolution.id]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">{resolution.description}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600">Successful Days</h3>
          <p className="text-3xl font-bold text-green-500">{stats.successDays}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600">Failed Days</h3>
          <p className="text-3xl font-bold text-red-500">{stats.failedDays}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600">Remaining Days</h3>
          <p className="text-3xl font-bold text-blue-500">{stats.remainingDays}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600">Wagered Amount</h3>
          <p className="text-3xl font-bold text-purple-500">${resolution.wager_amount}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;