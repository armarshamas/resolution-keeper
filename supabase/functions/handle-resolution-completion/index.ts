import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Connection, PublicKey, Transaction, SystemProgram } from 'https://esm.sh/@solana/web3.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get completed resolutions
    const { data: completedResolutions, error: fetchError } = await supabaseClient
      .from('resolutions')
      .select('*')
      .eq('status', 'completed')
      .is('processed', null)

    if (fetchError) throw fetchError

    for (const resolution of completedResolutions) {
      const connection = new Connection(Deno.env.get('SOLANA_RPC_URL') ?? '')
      const fromWallet = new PublicKey(Deno.env.get('TREASURY_WALLET_ADDRESS') ?? '')
      const toWallet = new PublicKey(resolution.wallet_address)

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromWallet,
          toPubkey: toWallet,
          lamports: resolution.wager_amount * 1e9, // Convert to lamports
        })
      )

      // Send transaction
      try {
        const signature = await connection.sendTransaction(transaction, [])
        
        // Mark resolution as processed
        await supabaseClient
          .from('resolutions')
          .update({ processed: true, transaction_signature: signature })
          .eq('id', resolution.id)
      } catch (error) {
        console.error(`Failed to process resolution ${resolution.id}:`, error)
      }
    }

    return new Response(
      JSON.stringify({ message: 'Resolutions processed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})