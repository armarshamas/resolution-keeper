import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Coins, Calendar, Trophy } from "lucide-react";

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
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Resolution Keeper</h1>
          <p className="text-xl mb-8 text-gray-300">
            Transform your New Year's resolutions into achievable goals with real accountability.
            Stake your commitment and let your determination earn you rewards.
          </p>
          <div className="space-y-6">
            <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200" />
            <p className="text-sm text-gray-400">
              Connect your Solana wallet to begin your journey towards success
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-16 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Make Your Stake</h3>
            <p className="text-gray-300">
              Set your resolution and stake an amount. This creates real accountability for your commitment.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Track Daily Progress</h3>
            <p className="text-gray-300">
              Check in daily to mark your progress. Each day counts towards your year-long journey.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Earn Your Reward</h3>
            <p className="text-gray-300">
              Complete your resolution to get your stake back. If not, it goes to charity.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Resolution Keeper?</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-start space-x-4">
            <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Real Stakes, Real Results</h3>
              <p className="text-gray-300">
                By staking actual value, you create genuine accountability for your goals.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Daily Progress Tracking</h3>
              <p className="text-gray-300">
                Visual progress tracking helps you stay motivated and see your journey clearly.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Win-Win Outcome</h3>
              <p className="text-gray-300">
                Succeed and reclaim your stake, or know your contribution supports charitable causes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;