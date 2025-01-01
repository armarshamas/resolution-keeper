import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "@/integrations/supabase/client";
import ResolutionForm from "@/components/ResolutionForm";
import ResolutionTracker from "@/components/ResolutionTracker";
import ProgressStats from "@/components/ProgressStats";

const Dashboard = () => {
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();
  const [activeResolution, setActiveResolution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected) {
      navigate("/");
      return;
    }

    const fetchResolution = async () => {
      const { data, error } = await supabase
        .from("resolutions")
        .select("*")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .eq("status", "active")
        .single();

      if (!error && data) {
        setActiveResolution(data);
      }
      setLoading(false);
    };

    fetchResolution();
  }, [connected, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {!activeResolution ? (
          <ResolutionForm walletAddress={publicKey?.toString()} />
        ) : (
          <div className="space-y-8">
            <ProgressStats resolution={activeResolution} />
            <ResolutionTracker resolutionId={activeResolution.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;