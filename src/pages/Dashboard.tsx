import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "@/integrations/supabase/client";
import ResolutionForm from "@/components/ResolutionForm";
import ResolutionTracker from "@/components/ResolutionTracker";
import ProgressStats from "@/components/ProgressStats";
import { Resolution } from "@/types/database";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { connected, publicKey, disconnect } = useWallet();
  const [activeResolution, setActiveResolution] = useState<Resolution | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!connected) {
      navigate("/");
      return;
    }

    const fetchResolution = async () => {
      try {
        const { data: resolution, error } = await supabase
          .from("resolutions")
          .select("*")
          .eq("wallet_address", publicKey?.toString())
          .eq("status", "active")
          .maybeSingle();

        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch resolution data. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (resolution) {
          setActiveResolution(resolution);
        }
      } catch (error) {
        console.error("Error fetching resolution:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResolution();
  }, [connected, navigate, publicKey, toast]);

  const handleDisconnect = async () => {
    await disconnect();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-4">
              <WalletMultiButton />
              {connected && (
                <Button variant="outline" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {!activeResolution ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <h1 className="text-2xl font-bold mb-4">Start Your Resolution Journey</h1>
              <p className="text-gray-600 mb-6">
                Create your resolution and set your wager to begin your 365-day challenge.
                Remember, your commitment today shapes your success tomorrow.
              </p>
            </div>
            <ResolutionForm walletAddress={publicKey?.toString() || ''} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold mb-4">Your Resolution Dashboard</h1>
              <p className="text-gray-600">
                Track your daily progress and stay committed to your goals. Remember,
                consistency is key to success!
              </p>
            </div>
            <ProgressStats resolution={activeResolution} />
            <ResolutionTracker resolutionId={activeResolution.id} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;