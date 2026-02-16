import React, { useEffect, useMemo, useState } from 'react';
import { CustomerPortal, AuthPage, AdminPortal } from '@/app/components';
import { supabase } from '@/lib/supabase';

type AppProperty = {
  id: string;
  name: string;
  address?: string | null;
  gardenType?: string | null;
  gardenArea?: number | null;
  healthScore?: number | null;
  nextService?: string | null;
  thumbnail?: string | null;
  plantHealth?: any[];
  serviceHistory?: any[];
};

type AppCustomer = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  memberSince?: string | null;
};

type NewPropertyInput = {
  name: string;
  address?: string;
  subDistrict?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  contactName?: string;
  contactPhone?: string;
  services?: string[];
  gardenArea?: string;
  gardenWidth?: string;
  gardenLength?: string;
  needMeasurement?: boolean;
  soilType?: string;
  sunlight?: string;
  waterSource?: string;
  specialRequests?: string;
};

// Main App
export default function App() {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'client' | 'admin'>(() => {
    const saved = window.localStorage.getItem('xylem_userRole');
    return saved === 'admin' ? 'admin' : 'client';
  });
  const [customer, setCustomer] = useState<AppCustomer | null>(null);
  const [properties, setProperties] = useState<AppProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<AppProperty | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    let unsub: { unsubscribe: () => void } | null = null;

    (async () => {
      try {
        if (!supabase) {
          setSessionUserId(null);
          return;
        }

        const { data } = await supabase.auth.getSession();
        const session = data.session;
        setSessionUserId(session?.user?.id ?? null);

        const roleFromMeta = session?.user?.user_metadata?.role;
        if (roleFromMeta === 'admin' || roleFromMeta === 'client') {
          window.localStorage.setItem('xylem_userRole', roleFromMeta);
          setUserRole(roleFromMeta);
        }

        unsub = supabase.auth.onAuthStateChange((_event, newSession) => {
          setSessionUserId(newSession?.user?.id ?? null);

          const roleFromMeta = newSession?.user?.user_metadata?.role;
          if (roleFromMeta === 'admin' || roleFromMeta === 'client') {
            window.localStorage.setItem('xylem_userRole', roleFromMeta);
            setUserRole(roleFromMeta);
          }
        }).data.subscription;
      } finally {
        setIsAuthLoading(false);
      }
    })();

    return () => {
      unsub?.unsubscribe();
    };
  }, []);

  const isAuthenticated = useMemo(() => Boolean(sessionUserId), [sessionUserId]);

  useEffect(() => {
    if (!isAuthenticated) {
      setSelectedProperty(null);
      setCustomer(null);
      setProperties([]);
      setDataError(null);
    } else if (userRole === 'client' && !selectedProperty) {
      // selection will be set after real properties load
    }
  }, [isAuthenticated, selectedProperty, userRole]);

  const loadClientData = async (userId: string) => {
    if (!supabase) {
      setDataError('Supabase ยังไม่ได้ตั้งค่า (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)');
      return;
    }

    const sb = supabase;

    setIsDataLoading(true);
    setDataError(null);

    const isMissingColumn = (err: any, column: string) => {
      const message = typeof err?.message === 'string' ? err.message : '';
      const details = typeof err?.details === 'string' ? err.details : '';
      return (
        message.includes(`Could not find the '${column}' column`) ||
        details.includes(`Could not find the '${column}' column`)
      );
    };

    const upsertOrCreateCustomer = async (fallbackName: string, email: string | null, phone: string | null) => {
      // Preferred: new schema uses user_id with a unique constraint.
      const preferred = await sb
        .from('customers')
        .upsert(
          {
            user_id: userId,
            email,
            name: fallbackName,
            phone,
          },
          { onConflict: 'user_id' }
        )
        .select('id, name, phone, email')
        .single();

      if (!preferred.error) return preferred;

      // Fallback: legacy schemas may only have owner_id.
      if (!isMissingColumn(preferred.error, 'user_id')) return preferred;

      const existing = await sb
        .from('customers')
        .select('id, name, phone, email')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing.error && !isMissingColumn(existing.error, 'owner_id')) return existing;
      if (existing.data) return existing;

      const inserted = await sb
        .from('customers')
        .insert({ owner_id: userId, email, name: fallbackName, phone })
        .select('id, name, phone, email')
        .single();

      return inserted;
    };

    const loadProperties = async () => {
      const preferred = await sb
        .from('properties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!preferred.error) return preferred;
      if (!isMissingColumn(preferred.error, 'user_id')) return preferred;

      const legacy = await sb
        .from('properties')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      return legacy;
    };

    try {
      const { data: userResp, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;

      const user = userResp.user;
      const fallbackName =
        (user?.user_metadata?.full_name as string | undefined) ||
        (user?.user_metadata?.name as string | undefined) ||
        user?.email ||
        'ลูกค้า';

      const { data: customerRow, error: customerErr } = await upsertOrCreateCustomer(
        fallbackName,
        user?.email ?? null,
        user?.phone ?? null
      );

      if (customerErr) throw customerErr;
      if (!customerRow) throw new Error('Customer record missing after upsert/insert');

      setCustomer({
        id: customerRow.id,
        name: customerRow.name ?? fallbackName,
        phone: customerRow.phone,
        email: customerRow.email,
        memberSince: (customerRow as any)?.member_since ?? null,
      });

      const { data: propertyRows, error: propsErr } = await loadProperties();
      if (propsErr) throw propsErr;

      const mapped: AppProperty[] = (propertyRows ?? []).map((p: any) => ({
        id: p.id,
        name: p.name,
        address: p.address,
        gardenType: p.garden_type,
        gardenArea: typeof p.garden_area_m2 === 'number' ? p.garden_area_m2 : p.garden_area_m2 ? Number(p.garden_area_m2) : null,
        healthScore: typeof p.health_score === 'number' ? p.health_score : p.health_score ? Number(p.health_score) : null,
        nextService: p.next_service_date ? String(p.next_service_date) : null,
        thumbnail: p.thumbnail_url,
        plantHealth: [],
        serviceHistory: [],
      }));

      setProperties(mapped);
    } catch (err) {
      const anyErr = err as any;
      const message =
        typeof anyErr?.message === 'string'
          ? anyErr.message
          : typeof anyErr?.error_description === 'string'
            ? anyErr.error_description
            : typeof anyErr?.details === 'string'
              ? anyErr.details
              : '';

      console.warn('Failed to load client data:', err);
      setDataError(
        `โหลดข้อมูลลูกค้า/บ้านไม่สำเร็จ${message ? `: ${message}` : ''} (ตรวจสอบว่าได้รัน supabase/schema.sql แล้ว และใช้โปรเจกต์/URL/KEY ถูกตัว)`
      );
      setCustomer(null);
      setProperties([]);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !sessionUserId) return;
    if (userRole !== 'client') return;
    void loadClientData(sessionUserId);
  }, [isAuthenticated, sessionUserId, userRole]);

  useEffect(() => {
    if (!isAuthenticated || userRole !== 'client') return;
    if (properties.length === 0) {
      setSelectedProperty(null);
      return;
    }

    if (!selectedProperty) {
      setSelectedProperty(properties[0]);
      return;
    }

    const stillExists = properties.some((p) => p.id === selectedProperty.id);
    if (!stillExists) setSelectedProperty(properties[0]);
  }, [isAuthenticated, properties, selectedProperty, userRole]);

  const createProperty = async (input: NewPropertyInput) => {
    if (!supabase) throw new Error('Supabase not configured');
    if (!sessionUserId) throw new Error('Not authenticated');

    const sb = supabase;

    const toNum = (v?: string) => {
      if (!v) return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const baseRow: any = {
      name: input.name,
      address: input.address ?? null,
      sub_district: input.subDistrict ?? null,
      district: input.district ?? null,
      province: input.province ?? null,
      postal_code: input.postalCode ?? null,
      contact_name: input.contactName ?? null,
      contact_phone: input.contactPhone ?? null,
      services: input.services ?? [],
      garden_area_m2: toNum(input.gardenArea),
      garden_width_m: toNum(input.gardenWidth),
      garden_length_m: toNum(input.gardenLength),
      need_measurement: Boolean(input.needMeasurement),
      soil_type: input.soilType ?? null,
      sunlight: input.sunlight ?? null,
      water_source: input.waterSource ?? null,
      special_requests: input.specialRequests ?? null,
    };

    // Preferred schema uses user_id.
    const preferred = await sb.from('properties').insert({ ...baseRow, user_id: sessionUserId });
    if (!preferred.error) {
      await loadClientData(sessionUserId);
      return;
    }

    const message = typeof preferred.error?.message === 'string' ? preferred.error.message : '';
    if (!message.includes("Could not find the 'user_id' column")) {
      throw preferred.error;
    }

    // Legacy fallback uses owner_id.
    const legacy = await sb.from('properties').insert({ ...baseRow, owner_id: sessionUserId });
    if (legacy.error) throw legacy.error;

    await loadClientData(sessionUserId);
  };

  const logout = async () => {
    window.localStorage.setItem('xylem_userRole', 'client');
    setUserRole('client');
    setSelectedProperty(null);
    if (supabase) await supabase.auth.signOut();
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-gray-50">
        <div className="text-sm text-gray-600">กำลังตรวจสอบการเข้าสู่ระบบ…</div>
      </div>
    );
  }

  // Show Auth Page if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthPage
        onLogin={(role) => {
          setUserRole(role);
          window.localStorage.setItem('xylem_userRole', role);
        }}
      />
    );
  }

  // Show Admin Portal if logged in as admin
  if (userRole === 'admin') {
    return (
      <AdminPortal
        onLogout={logout}
      />
    );
  }

  // Show Customer Portal
  if (userRole === 'client') {
    if (isDataLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-gray-50">
          <div className="text-sm text-gray-600">กำลังโหลดข้อมูลลูกค้า/บ้าน…</div>
        </div>
      );
    }

    if (dataError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-gray-50 p-6">
          <div className="max-w-xl w-full bg-white border border-gray-100 rounded-2xl p-6">
            <div className="text-sm font-semibold text-gray-900 mb-2">เชื่อมต่อข้อมูลไม่สำเร็จ</div>
            <div className="text-sm text-gray-600 mb-4">{dataError}</div>
            <div className="flex gap-2">
              <button
                onClick={() => sessionUserId && void loadClientData(sessionUserId)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
              >
                ลองใหม่
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-900 text-sm font-medium hover:bg-gray-200 transition"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <CustomerPortal 
      customer={customer ?? { id: 'me', name: 'ลูกค้า' }}
      onLogout={logout}
      properties={properties}
      selectedProperty={selectedProperty}
      onPropertySelect={(property: any) => {
        setSelectedProperty(property);
      }}
      onViewService={(service: any) => {
        console.log('View service:', service);
      }}
      onCreateProperty={createProperty}
    />
  );
}