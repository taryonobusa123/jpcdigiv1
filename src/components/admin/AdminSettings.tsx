
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  // For now, just use local state as mock.
  const [username, setUsername] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulasi save, nanti ganti panggil Supabase function/mutation.
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Berhasil",
        description: "Pengaturan Digiflazz API telah disimpan.",
      });
    }, 1200);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan API Digiflazz</CardTitle>
      </CardHeader>
      <CardContent>
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
            />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-4">
          API key tidak akan ditampilkan setelah tersimpan demi alasan keamanan.
        </p>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
