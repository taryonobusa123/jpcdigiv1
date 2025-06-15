
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProofUploadProps {
  proofImage: string;
  onProofImageChange: (image: string) => void;
}

const ProofUpload = ({ proofImage, onProofImageChange }: ProofUploadProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Bukti Transfer (Opsional)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="proof-image">Link gambar bukti transfer</Label>
          <Input
            id="proof-image"
            type="url"
            placeholder="https://example.com/bukti-transfer.jpg"
            value={proofImage}
            onChange={(e) => onProofImageChange(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Upload bukti transfer ke layanan hosting gambar dan masukkan linknya di sini
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProofUpload;
