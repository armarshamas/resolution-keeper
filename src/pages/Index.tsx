import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { connected } = useWallet();

  useEffect(() => {
    if (connected) {
      navigate("/dashboard");
    }
  }, [connected, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-8">Resolution Keeper</h1>
          <p className="text-xl mb-12 text-gray-300">
            Make your New Year's resolutions count. Stake your commitment and track your progress daily.
            Succeed and get your stake back, or have it donated to charity if you fail.
          </p>
          
          <div className="space-y-6">
            <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200" />
            <p className="text-sm text-gray-400">
              Connect your Solana wallet to get started with your resolution journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;