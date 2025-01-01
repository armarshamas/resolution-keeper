import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ResolutionFormProps {
  walletAddress: string;
}

const ResolutionForm = ({ walletAddress }: ResolutionFormProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      const { error } = await supabase
        .from("resolutions")
        .insert({
          description: data.description,
          wager_amount: parseFloat(data.wagerAmount),
          wallet_address: walletAddress,
          end_date: endDate.toISOString(),
          user_id: (await supabase.auth.getUser()).data.user?.id,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your resolution has been created.",
      });

      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create resolution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create Your Resolution</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Your Resolution</label>
          <Textarea
            {...register("description", { required: "Resolution is required" })}
            placeholder="e.g., Work out every day for 365 days"
            className="w-full"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Wager Amount (USD)</label>
          <Input
            type="number"
            step="0.01"
            {...register("wagerAmount", {
              required: "Wager amount is required",
              min: { value: 1, message: "Minimum wager is $1" },
            })}
            placeholder="Enter amount"
          />
          {errors.wagerAmount && (
            <p className="text-red-500 text-sm mt-1">{errors.wagerAmount.message as string}</p>
          )}
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Creating..." : "Create Resolution"}
        </Button>
      </form>
    </div>
  );
};

export default ResolutionForm;