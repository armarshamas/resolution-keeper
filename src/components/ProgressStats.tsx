import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Resolution, DailyUpdate } from "@/types/database";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Calendar, CheckCircle, XCircle, DollarSign } from "lucide-react";

interface ProgressStatsProps {
  resolution: Resolution;
}

const ProgressStats = ({ resolution }: ProgressStatsProps) => {
  const [stats, setStats] = useState({
    successDays: 0,
    failedDays: 0,
    remainingDays: 365,
    progress: 0
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
        const progress = Math.round((successDays / 365) * 100);

        setStats({ successDays, failedDays, remainingDays, progress });
      }
    };

    fetchStats();
  }, [resolution.id]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-green-100 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Successful Days</p>
            <h3 className="text-2xl font-bold text-green-600">{stats.successDays}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-red-100 rounded-full">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Failed Days</p>
            <h3 className="text-2xl font-bold text-red-600">{stats.failedDays}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-100 rounded-full">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Remaining Days</p>
            <h3 className="text-2xl font-bold text-blue-600">{stats.remainingDays}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-purple-100 rounded-full">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Wagered Amount</p>
            <h3 className="text-2xl font-bold text-purple-600">${resolution.wager_amount}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6 md:col-span-2 lg:col-span-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <h4 className="font-medium">Overall Progress</h4>
            </div>
            <span className="text-sm font-medium">{stats.progress}%</span>
          </div>
          <Progress value={stats.progress} className="h-2" />
        </div>
      </Card>
    </div>
  );
};

export default ProgressStats;