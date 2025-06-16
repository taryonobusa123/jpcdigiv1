
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatWhatsAppNumber = (number: string) => {
    // Remove all non-digits
    const cleaned = number.replace(/\D/g, '');
    
    // Add +62 prefix if it starts with 0
    if (cleaned.startsWith('0')) {
      return '+62' + cleaned.substring(1);
    }
    
    // Add +62 prefix if it doesn't start with 62
    if (!cleaned.startsWith('62')) {
      return '+62' + cleaned;
    }
    
    return '+' + cleaned;
  };

  const validateInput = (email: string, password: string, fullName: string, whatsappNumber: string) => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Email Tidak Valid",
        description: "Silakan masukkan email yang valid.",
        variant: "destructive",
      });
      return false;
    }

    if (!password || password.length < 6) {
      toast({
        title: "Password Terlalu Pendek",
        description: "Password harus minimal 6 karakter.",
        variant: "destructive",
      });
      return false;
    }

    if (!fullName || fullName.trim().length < 2) {
      toast({
        title: "Nama Tidak Valid",
        description: "Silakan masukkan nama lengkap yang valid.",
        variant: "destructive",
      });
      return false;
    }

    if (!whatsappNumber || whatsappNumber.length < 10) {
      toast({
        title: "Nomor WhatsApp Tidak Valid",
        description: "Silakan masukkan nomor WhatsApp yang valid.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      // Redirect to WhatsApp verification instead of home
      navigate('/verify-whatsapp');
    } catch (error) {
      console.error('Sign in error:', error);
    }
    setLoading(false);
  };

  const checkUserExists = async (email: string) => {
    try {
      // Check if user exists in profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  };

  const checkWhatsAppExists = async (whatsappNumber: string) => {
    try {
      // Check if WhatsApp number exists in profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, whatsapp_number')
        .eq('whatsapp_number', whatsappNumber)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking WhatsApp number:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking WhatsApp number existence:', error);
      return false;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formattedWhatsapp = formatWhatsAppNumber(whatsappNumber);
      
      // Validate input first
      if (!validateInput(email, password, fullName, formattedWhatsapp)) {
        setLoading(false);
        return;
      }

      console.log('Starting signup process with:', {
        email,
        fullName: fullName.trim(),
        whatsappNumber: formattedWhatsapp
      });

      // Check if user already exists
      const userExists = await checkUserExists(email);
      
      if (userExists) {
        toast({
          title: "Akun Sudah Terdaftar",
          description: "Email ini sudah terdaftar. Silakan login atau gunakan email lain.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Check if WhatsApp number already exists
      const whatsappExists = await checkWhatsAppExists(formattedWhatsapp);
      
      if (whatsappExists) {
        toast({
          title: "Nomor WhatsApp Sudah Terdaftar",
          description: "Nomor WhatsApp ini sudah terdaftar. Silakan gunakan nomor lain.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create user with Supabase Auth directly
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            whatsapp_number: formattedWhatsapp,
          },
        },
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        
        // Handle specific auth errors
        if (authError.message.includes('duplicate')) {
          toast({
            title: "Akun Sudah Terdaftar",
            description: "Email ini sudah terdaftar. Silakan login atau gunakan email lain.",
            variant: "destructive",
          });
        } else if (authError.message.includes('invalid')) {
          toast({
            title: "Data Tidak Valid",
            description: "Silakan periksa kembali data yang Anda masukkan.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error Registrasi",
            description: authError.message || "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
            variant: "destructive",
          });
        }
        setLoading(false);
        return;
      }

      console.log('Signup successful:', authData);
      
      toast({
        title: "Berhasil",
        description: "Registrasi berhasil. Silakan cek email untuk verifikasi.",
      });
      
      // After successful signup, redirect to WhatsApp verification
      navigate(`/verify-whatsapp?number=${encodeURIComponent(formattedWhatsapp)}`);
      
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      
      toast({
        title: "Error Registrasi",
        description: "Terjadi kesalahan tidak terduga. Silakan coba lagi.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const handleWhatsAppChange = (value: string) => {
    // Only allow numbers, +, and common formatting characters
    const cleaned = value.replace(/[^\d+\-\s()]/g, '');
    setWhatsappNumber(cleaned);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Masuk / Daftar</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Selamat Datang
            </CardTitle>
            <CardDescription>
              Masuk ke akun Anda atau buat akun baru
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Masuk</TabsTrigger>
                <TabsTrigger value="signup">Daftar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-500 hover:bg-green-600" 
                    disabled={loading}
                  >
                    {loading ? 'Masuk...' : 'Masuk'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nama Lengkap</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nama lengkap Anda"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Nomor WhatsApp</span>
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => handleWhatsAppChange(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Contoh: 0812345678 atau +6281234567890
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail" className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-500 hover:bg-green-600" 
                    disabled={loading}
                  >
                    {loading ? 'Mendaftar...' : 'Daftar Akun'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
