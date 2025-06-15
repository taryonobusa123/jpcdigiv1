
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LoginPrompt = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Login Diperlukan</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">Silakan login untuk melakukan top up saldo</p>
          <Link to="/login">
            <Button className="w-full">Login Sekarang</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPrompt;
