
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useDigiflazzConfig() {
  // Ambil config pertama (diasumsikan hanya satu config)
  return useQuery({
    queryKey: ["digiflazz-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("digiflazz_config")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      if (!data || data.length === 0) return null;
      return data[0];
    },
  });
}

export function useSaveDigiflazzConfig() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      username,
      apiKey,
      mode,
      id,
    }: {
      username: string;
      apiKey: string;
      mode?: string;
      id?: string;
    }) => {
      if (id) {
        // Update config
        const { error } = await supabase
          .from("digiflazz_config")
          .update({
            username,
            api_key: apiKey,
            mode: mode ?? "live",
            created_at: new Date().toISOString(),
          })
          .eq("id", id);
        if (error) throw error;
      } else {
        // Insert new config
        const { error } = await supabase
          .from("digiflazz_config")
          .insert({
            username,
            api_key: apiKey,
            mode: mode ?? "live",
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
          });
        if (error) throw error;
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digiflazz-config"] });
      toast({
        title: "Berhasil",
        description: "Pengaturan Digiflazz API telah disimpan.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error?.message || "Gagal menyimpan data.",
        variant: "destructive",
      });
    },
  });
}
