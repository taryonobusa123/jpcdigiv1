
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
        <CardTitle className="text-lg">Kode Referensi Transfer (Opsional)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="ref-code">Kode referensi transfer</Label>
          <Input
            id="ref-code"
            type="text"
            placeholder="Masukkan kode referensi transfer"
            value={proofImage}
            onChange={(e) => onProofImageChange(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Masukkan kode referensi transfer yang diberikan oleh bank atau aplikasi pembayaran
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProofUpload;
