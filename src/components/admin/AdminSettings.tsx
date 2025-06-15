
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useDigiflazzConfig, useSaveDigiflazzConfig } from "@/hooks/useDigiflazzConfig";

const AdminSettings = () => {
  const { data: config, isLoading, error } = useDigiflazzConfig();
  const saveConfig = useSaveDigiflazzConfig();
  const [username, setUsername] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [mode, setMode] = useState("live");
  const { toast } = useToast();

  useEffect(() => {
    if (config) {
      setUsername(config.username || "");
      setApiKey(""); // demi keamanan, tidak tampilkan key walau ada data, user harus input ulang
      setMode(config.mode || "live");
    }
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !apiKey) {
      toast({
        title: "Error",
        description: "Username dan API Key harus diisi.",
        variant: "destructive",
      });
      return;
    }
    saveConfig.mutate({
      username,
      apiKey,
      mode,
      id: config?.id,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan API Digiflazz</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Memuat konfigurasi...</div>
        ) : (
          <form className="space-y-4 max-w-lg" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="digiflazz-username">Username Digiflazz</Label>
              <Input
                type="text"
                id="digiflazz-username"
                placeholder="Username Digiflazz"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={saveConfig.isPending}
              />
            </div>
            <div>
              <Label htmlFor="digiflazz-apikey">API Key Digiflazz</Label>
              <Input
                type="password"
                id="digiflazz-apikey"
                placeholder="API Key Digiflazz"
                autoComplete="off"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                disabled={saveConfig.isPending}
              />
            </div>
            {/* Opsi mode future-proof kalau ingin tambah sandbox/live */}
            <div>
              <Label htmlFor="digiflazz-mode">Mode</Label>
              <Input
                type="text"
                id="digiflazz-mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                disabled
                className="bg-muted"
              />
            </div>
            <Button type="submit" disabled={saveConfig.isPending || !username || !apiKey}>
              {saveConfig.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        )}
        {error && (
          <div className="text-xs text-destructive mt-2">{error.message}</div>
        )}
        <p className="text-xs text-muted-foreground mt-4">
          API key tidak akan ditampilkan setelah tersimpan demi alasan keamanan.
        </p>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
