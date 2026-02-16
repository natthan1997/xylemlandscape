import React, { useState } from 'react';
import {
  Leaf,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

interface AuthPageProps {
  onLogin: (role: 'client' | 'admin') => void;
}

type NoticeState = {
  message: string;
  variant?: 'default' | 'destructive';
};

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');

  const persistRoleFromUser = (user: any) => {
    const roleFromMeta = user?.user_metadata?.role;
    const role: 'client' | 'admin' = roleFromMeta === 'admin' ? 'admin' : 'client';
    window.localStorage.setItem('xylem_userRole', role);
    return role;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!isSupabaseConfigured || !supabase) {
      setNotice({
        message: 'ยังไม่ได้ตั้งค่า Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.email || !formData.password) {
      setNotice({ message: 'กรุณากรอกอีเมลและรหัสผ่าน', variant: 'destructive' });
      return;
    }

    if (authView === 'register') {
      if (!confirmPassword) {
        setNotice({ message: 'กรุณายืนยันรหัสผ่าน', variant: 'destructive' });
        return;
      }
      if (formData.password !== confirmPassword) {
        setNotice({ message: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน', variant: 'destructive' });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (authView === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        if (data.session) {
          const role = persistRoleFromUser(data.user);
          onLogin(role);
        }
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'client',
          },
        },
      });
      if (error) throw error;

      if (data.session) {
        window.localStorage.setItem('xylem_userRole', 'client');
        onLogin('client');
      } else {
        setNotice({ message: 'สมัครสมาชิกสำเร็จ กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ', variant: 'default' });
        setAuthView('login');
      }
    } catch (err) {
      setNotice({ message: (err as Error).message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'facebook') => {
    setNotice(null);
    if (!isSupabaseConfigured || !supabase) {
      setNotice({
        message: 'ยังไม่ได้ตั้งค่า Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;

      if (!data?.url) {
        throw new Error('OAuth URL missing');
      }
      window.location.href = data.url;
    } catch (err) {
      setNotice({ message: (err as Error).message, variant: 'destructive' });
      setIsSubmitting(false);
    }
  };

  const startLineLogin = async () => {
    setNotice(null);
    setIsSubmitting(true);
    try {
      const resp = await fetch('/api/line-login-start', { method: 'POST' });
      const json = await resp.json().catch(() => null);
      if (!resp.ok) throw new Error(json?.error || 'LINE login start failed');
      if (!json?.url) throw new Error('LINE login URL missing');

      window.location.href = json.url;
    } catch (err) {
      setNotice({ message: (err as Error).message, variant: 'destructive' });
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    const url = new URL(window.location.href);
    if (url.pathname !== '/auth/line/callback') return;

    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const errorDesc = url.searchParams.get('error_description');

    if (errorDesc) {
      setNotice({ message: decodeURIComponent(errorDesc), variant: 'destructive' });
      window.history.replaceState({}, '', '/');
      return;
    }

    if (!code || !state) {
      setNotice({ message: 'LINE callback ไม่สมบูรณ์ (missing code/state)', variant: 'destructive' });
      window.history.replaceState({}, '', '/');
      return;
    }

    (async () => {
      try {
        if (!isSupabaseConfigured || !supabase) {
          setNotice({
            message: 'ยังไม่ได้ตั้งค่า Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)',
            variant: 'destructive',
          });
          return;
        }

        setIsSubmitting(true);
        const resp = await fetch('/api/line-login-exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, state }),
        });
        const json = await resp.json();
        if (!resp.ok) throw new Error(json?.error || 'LINE exchange failed');

        const idToken = json?.id_token as string | undefined;
        if (!idToken) throw new Error('Missing id_token from LINE exchange');

        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'https://access.line.me',
          token: idToken,
        });
        if (error) throw error;
        if (data.session) {
          const role = persistRoleFromUser(data.user);
          onLogin(role);
        }
      } catch (err) {
        setNotice({ message: (err as Error).message, variant: 'destructive' });
      } finally {
        setIsSubmitting(false);
        window.history.replaceState({}, '', '/');
      }
    })();
    // Intentionally run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="size-5" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold">XYLEM</div>
              <div className="text-sm text-muted-foreground">LANDSCAPE</div>
            </div>
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-semibold">
              {authView === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </CardTitle>
            <CardDescription>
              {authView === 'login'
                ? 'เข้าสู่ระบบเพื่อจัดการสวนและเอกสารของคุณ'
                : 'สร้างบัญชีใหม่เพื่อเริ่มใช้งานระบบ'}
            </CardDescription>
          </div>

          <Tabs
            value={authView}
            onValueChange={(v) => {
              setAuthView(v as 'login' | 'register');
              setNotice(null);
            }}
            className="w-full"
          >
            <TabsList className="w-full">
              <TabsTrigger value="login">เข้าสู่ระบบ</TabsTrigger>
              <TabsTrigger value="register">สมัครสมาชิก</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="space-y-5">
          {notice && (
            <Alert variant={notice.variant ?? 'default'}>
              <AlertDescription>
                <p>{notice.message}</p>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@email.com"
                  disabled={isSubmitting}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={authView === 'login' ? 'current-password' : 'new-password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="pl-9 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>

            {authView === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    className="pl-9 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <span>{isSubmitting ? 'กำลังดำเนินการ…' : authView === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</span>
              <ArrowRight className="ml-1" />
            </Button>
          </form>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-2 text-xs text-muted-foreground">หรือเข้าสู่ระบบด้วย</span>
            </div>
          </div>

          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => signInWithProvider('google')}
              disabled={isSubmitting}
              className="w-full social-btn social-google justify-center"
            >
              <span className="social-icon" aria-hidden>
                <svg viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.3h147.2c-6.4 34.9-25.6 64.4-54.6 84.3v69h88.2c51.6-47.6 81.7-117.7 81.7-198.2z"/>
                  <path fill="#34A853" d="M272 544.3c73.6 0 135.4-24.3 180.6-66.2l-88.2-69c-24.5 16.5-55.8 26.1-92.4 26.1-70.9 0-131-47.8-152.4-112.1H29.6v70.7C74.6 486.5 166.3 544.3 272 544.3z"/>
                  <path fill="#FBBC05" d="M119.6 325.9c-10.9-32.5-10.9-67.6 0-100.1V155.1H29.6c-39.5 77.6-39.5 169.4 0 246.9l90-76.1z"/>
                  <path fill="#EA4335" d="M272 107.6c39.9 0 75.9 13.7 104.2 40.6l78.1-78.1C404.9 24.6 343.1 0 272 0 166.3 0 74.6 57.8 29.6 155.1l90 70.7C141 155.4 201.1 107.6 272 107.6z"/>
                </svg>
              </span>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => signInWithProvider('facebook')}
              disabled={isSubmitting}
              className="w-full social-btn social-facebook justify-center"
            >
              <span className="social-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.99H7.898v-2.888h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.466h-1.26c-1.242 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.888h-2.33v6.99C18.343 21.128 22 16.991 22 12z" fill="#fff"/>
                </svg>
              </span>
              <span>Facebook</span>
            </button>

            <button
              type="button"
              onClick={startLineLogin}
              disabled={isSubmitting}
              className="w-full social-btn social-line justify-center"
            >
              <span className="social-icon" aria-hidden>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#fff" d="M12 2C6.477 2 2 5.865 2 10.115c0 2.57 1.655 4.89 4.396 6.356L6 21l4.004-1.41C11.12 19.76 11.56 19.78 12 19.78c5.523 0 10-3.865 10-8.115S17.523 2 12 2z"/>
                </svg>
              </span>
              <span>LINE</span>
            </button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <Button
            type="button"
            variant="link"
            onClick={() => setAuthView(authView === 'login' ? 'register' : 'login')}
            disabled={isSubmitting}
          >
            {authView === 'login' ? 'ยังไม่มีบัญชี? สมัครสมาชิก' : 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
