import React, { useEffect, useMemo, useState, useRef } from 'react';
import { LocationPicker } from './LocationPicker';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  MapPin, 
  Home, 
  Trees, 
  CalendarRange, 
  XCircle, 
  X, 
  ChevronRight, 
  CheckCircle2,
  Building2,
  Warehouse,
  Dog,
  Cat,
  Rabbit,
  Clock,
  Sparkles
} from 'lucide-react';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { cn } from './ui/utils';

type PropertySetupData = {
  name: string;
  type: string;
  address?: string;
  subDistrict?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  mapLink?: string;
  contactName?: string;
  contactPhone?: string;
  gardenArea?: string;
  gardenWidth?: string;
  gardenLength?: string;
  needMeasurement?: boolean;
  petInfo?: string;
  specialRequests?: string;
  serviceWindowStart?: string;
  serviceWindowEnd?: string;
  serviceDays?: string[];
};

interface PropertySetupFormProps {
  onComplete: (data: PropertySetupData) => void | Promise<void>;
  onCancel?: () => void;
}

const PROPERTY_TYPES = [
  { id: 'detached', label: 'บ้านเดี่ยว', icon: Home, description: 'บ้านจัดสรร / บ้านปลูกเอง' },
  { id: 'twin', label: 'บ้านแฝด', icon: Home, description: 'ผนังติดกันด้านหนึ่ง' },
  { id: 'townhome', label: 'ทาวน์โฮม', icon: Building2, description: 'ตึกแถว / ทาวน์เฮ้าส์' },
  { id: 'commercial', label: 'อาคารพาณิชย์', icon: Building2, description: 'ร้านค้า / ออฟฟิศ' },
  { id: 'land', label: 'ที่ดินเปล่า', icon: Trees, description: 'ยังไม่มีสิ่งปลูกสร้าง' },
  { id: 'other', label: 'อื่นๆ', icon: Warehouse, description: 'ประเภทอื่นๆ' },
];

const PET_TYPES = [
  { id: 'none', label: 'ไม่มีสัตว์เลี้ยง', icon: XCircle },
  { id: 'indoor', label: 'เลี้ยงในบ้าน', icon: Cat },
  { id: 'outdoor', label: 'เลี้ยงนอกบ้าน', icon: Dog },
];

const toMinutes = (timeStr: string) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

export const PropertySetupForm: React.FC<PropertySetupFormProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'detached',
    address: '',
    mapLink: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: '',
    contactName: '',
    contactPhone: '',
    gardenArea: '',
    gardenWidth: '',
    gardenLength: '',
    needMeasurement: false,
    petInfo: 'none',
    serviceWindowStart: '',
    serviceWindowEnd: '',
    serviceDays: [] as string[],
  });

  const STEPS = [
    { title: 'ข้อมูลทั่วไป', icon: Home, description: 'ชื่อและประเภท' },
    { title: 'ที่อยู่', icon: MapPin, description: 'พิกัดสถานที่' },
    { title: 'พื้นที่สวน', icon: Trees, description: 'ขนาดและสิ่งแวดล้อม' },
    { title: 'วันเวลา', icon: CalendarRange, description: 'ช่วงเวลาบริการ' },
  ];

  // Helper for safe days array
  const safeServiceDays = formData.serviceDays || [];

  const daysOfWeek = [
    { id: 'sun', label: 'อา', fullName: 'วันอาทิตย์', color: 'bg-red-500' },
    { id: 'mon', label: 'จ', fullName: 'วันจันทร์', color: 'bg-yellow-400' },
    { id: 'tue', label: 'อ', fullName: 'วันอังคาร', color: 'bg-pink-400' },
    { id: 'wed', label: 'พ', fullName: 'วันพุธ', color: 'bg-green-500' },
    { id: 'thu', label: 'พฤ', fullName: 'วันพฤหัสบดี', color: 'bg-orange-400' },
    { id: 'fri', label: 'ศ', fullName: 'วันศุกร์', color: 'bg-blue-400' },
    { id: 'sat', label: 'ส', fullName: 'วันเสาร์', color: 'bg-purple-500' },
  ];

  type PostalEntry = { province: string; districts: { name: string; subdistricts: string[] }[] };
  type PostalLookup = Record<string, PostalEntry>;

  const [postalData, setPostalData] = useState<PostalLookup | null>(null);
  const [postalLoadState, setPostalLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [districtOptions, setDistrictOptions] = useState<{ name: string; subdistricts: string[] }[]>([]);
  const [subdistrictOptions, setSubdistrictOptions] = useState<string[]>([]);
  const postalLookupReqIdRef = useRef(0);

  const inlinePostalLookup: PostalLookup = useMemo(() => ({
    '10100': {
      province: 'กรุงเทพมหานคร',
      districts: [
        { name: 'พระนคร', subdistricts: ['พระบรมมหาราชวัง', 'วังบูรพา'] },
        { name: 'ปทุมวัน', subdistricts: ['ปทุมวัน'] },
      ],
    },
    '50300': {
      province: 'เชียงใหม่',
      districts: [
        { name: 'เมืองเชียงใหม่', subdistricts: ['พระสิงห์', 'หายยา'] },
      ],
    },
    '83000': {
      province: 'ภูเก็ต',
      districts: [
        { name: 'เมืองภูเก็ต', subdistricts: ['ตลาดใหญ่', 'ตลาดเหนือ'] },
      ],
    },
  }), []);

  const activePostalLookup: PostalLookup = useMemo(
    () => postalData ?? inlinePostalLookup,
    [postalData, inlinePostalLookup]
  );

  const ensurePostalDataLoaded = async () => {
    if (postalLoadState === 'ready' || postalLoadState === 'loading') return;
    setPostalLoadState('loading');
    try {
      const mod = (await import('@/data/postal-codes.json')) as unknown as { default: PostalLookup };
      setPostalData(mod.default);
      setPostalLoadState('ready');
    } catch (e) {
      console.warn('Failed to load postal dataset:', e);
      setPostalLoadState('error');
    }
  };

  const lookupPostalViaSupabase = async (postalCode: string, reqId: number) => {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('postal_code_areas')
      .select('province,district,subdistrict')
      .eq('postal_code', postalCode)
      .limit(500);

    if (reqId !== postalLookupReqIdRef.current) return null;
    if (error) {
      console.warn('Postal lookup (Supabase) failed:', error);
      return null;
    }
    return (data as Array<{ province: string; district: string; subdistrict: string }>) || null;
  };

  const applyPostalRows = (rows: Array<{ province: string; district: string; subdistrict: string }>) => {
    if (rows.length === 0) return;
    const province = rows[0].province;
    const byDistrict = new Map<string, Set<string>>();
    for (const row of rows) {
      const district = row.district?.trim();
      const subdistrict = row.subdistrict?.trim();
      if (!district || !subdistrict) continue;
      const existing = byDistrict.get(district) ?? new Set<string>();
      existing.add(subdistrict);
      byDistrict.set(district, existing);
    }
    const districts = Array.from(byDistrict.entries()).map(([name, subs]) => ({
      name,
      subdistricts: Array.from(subs.values()),
    }));
    setFormData((p) => ({ ...p, province, district: '', subDistrict: '' }));
    setDistrictOptions(districts);
    setSubdistrictOptions([]);
  };

  const handlePostalChange = (v: string) => {
    setFormData((p) => ({ ...p, postalCode: v }));
    const trimmed = v.trim();
    
    if (trimmed.length === 5) {
      void ensurePostalDataLoaded();
      const nextReqId = postalLookupReqIdRef.current + 1;
      postalLookupReqIdRef.current = nextReqId;

      void (async () => {
        const rows = await lookupPostalViaSupabase(trimmed, nextReqId);
        if (rows && rows.length) {
          applyPostalRows(rows);
          return;
        }
        const entry = activePostalLookup[trimmed];
        if (entry) {
          setFormData((p) => ({ ...p, province: entry.province, district: '', subDistrict: '' }));
          setDistrictOptions(entry.districts);
          setSubdistrictOptions([]);
          return;
        }
        // Not found
        setFormData((p) => ({ ...p, district: '', subDistrict: '' }));
        setDistrictOptions([]);
        setSubdistrictOptions([]);
      })();
    }
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    const link = `https://www.google.com/maps?q=${lat},${lng}`;
    setFormData((p) => ({ ...p, mapLink: link }));
  };

  useEffect(() => {
    const code = formData.postalCode.trim();
    if (code.length !== 5) return;
    const entry = activePostalLookup[code];
    if (!entry) return;
    if (formData.province && formData.province === entry.province && districtOptions.length > 0) return;
    
    setFormData((p) => ({ ...p, province: entry.province, district: '', subDistrict: '' }));
    setDistrictOptions(entry.districts);
    setSubdistrictOptions([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postalLoadState, activePostalLookup]);

  const validateStep = (step: number) => {
    switch (step) {
      case 0: // General
        return !!formData.name;
      case 1: // Address
        return !!formData.postalCode && !!formData.district && !!formData.subDistrict;
      case 2: // Garden
        if (formData.needMeasurement) return true;
        return !!formData.gardenArea; // simplified validation
      case 3: // Time
        return true; // Optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(p => p + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        void handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const submissionData: PropertySetupData = {
        ...formData,
      };
      
      await onComplete(submissionData);
    } catch (err) {
      console.error(err);
      setSubmitError('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availabilityPreview = useMemo(() => {
    const days = safeServiceDays
      .map((d) => daysOfWeek.find((w) => w.id === d)?.label)
      .filter(Boolean)
      .join(", ");
    const time =
      formData.serviceWindowStart && formData.serviceWindowEnd
        ? `${formData.serviceWindowStart} - ${formData.serviceWindowEnd}`
        : "";
    if (!days && !time) return null;
    return [days, time].filter(Boolean).join(" | ");
  }, [safeServiceDays, daysOfWeek, formData.serviceWindowStart, formData.serviceWindowEnd]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // General
        return (
          <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 md:col-span-2">
                <div className="space-y-2">
                  <Label htmlFor="property-name" className="text-emerald-900 text-base font-semibold">
                    ตั้งชื่อบ้านของคุณ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="property-name"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="เช่น บ้านเชียงใหม่, บ้านริมทะเล"
                    required
                    className="h-12 text-lg border-emerald-100 bg-white/50 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 shadow-sm"
                  />
                  <p className="text-sm text-emerald-600/60">ชื่อที่ช่วยให้คุณจดจำบ้านหลังนี้ได้ง่ายขึ้น</p>
                </div>
              </div>

              <div className="space-y-4 md:col-span-2">
                <Label className="text-emerald-900 text-base font-semibold">
                  ประเภทที่พักอาศัย <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {PROPERTY_TYPES.map((t) => {
                    const Icon = t.icon;
                    const isSelected = formData.type === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setFormData(p => ({ ...p, type: t.id }))}
                        className={cn(
                          "cursor-pointer group relative flex flex-col p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md",
                          isSelected
                            ? "border-emerald-500 bg-emerald-50/80 shadow-emerald-100"
                            : "border-transparent bg-white shadow-sm hover:border-emerald-200"
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className={cn(
                            "p-2 rounded-lg transition-colors",
                            isSelected ? "bg-emerald-100 text-emerald-600" : "bg-emerald-50 text-emerald-400 group-hover:text-emerald-500"
                          )}>
                            <Icon className="w-6 h-6" />
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        </div>
                        <span className={cn(
                          "font-semibold text-lg mb-1",
                          isSelected ? "text-emerald-900" : "text-gray-700"
                        )}>{t.label}</span>
                        <span className="text-xs text-gray-500">{t.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 leading-none">
                <Label htmlFor="contact-name" className="text-emerald-900 text-base font-semibold">ชื่อผู้ติดต่อ</Label>
                <Input
                  id="contact-name"
                  value={formData.contactName}
                  onChange={(e) => setFormData((p) => ({ ...p, contactName: e.target.value }))}
                  placeholder="ชื่อ-นามสกุล"
                  className="h-11 border-emerald-100 bg-white/50 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                />
              </div>

              <div className="space-y-4 leading-none">
                <Label htmlFor="contact-phone" className="text-emerald-900 text-base font-semibold">เบอร์โทรติดต่อ</Label>
                <Input
                  id="contact-phone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData((p) => ({ ...p, contactPhone: e.target.value }))}
                  placeholder="0XX-XXX-XXXX"
                  inputMode="tel"
                  className="h-11 border-emerald-100 bg-white/50 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                />
              </div>
            </div>
          </div>
        );

      case 1: // Address
        return (
          <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label htmlFor="postal" className="text-emerald-900 text-base font-semibold">
                  รหัสไปรษณีย์ <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="postal"
                    value={formData.postalCode}
                    onChange={(e) => handlePostalChange(e.target.value)}
                    placeholder="xxxxx"
                    maxLength={5}
                    inputMode="numeric"
                    className="h-12 text-lg tracking-widest border-emerald-100 bg-white/50 focus-visible:ring-emerald-500 pr-10"
                  />
                  {postalLoadState === "loading" && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-emerald-600/60">ระบบจะค้นหาเขต/แขวงให้อัตโนมัติ</p>
              </div>

              <div className="space-y-4">
                <Label htmlFor="province" className="text-emerald-900 text-base font-semibold">จังหวัด</Label>
                <Input
                  id="province"
                  value={formData.province}
                  readOnly
                  className="h-12 bg-emerald-50/50 border-emerald-100 text-emerald-900 font-medium cursor-not-allowed"
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="district" className="text-emerald-900 text-base font-semibold">อำเภอ/เขต <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.district || undefined}
                  disabled={districtOptions.length === 0}
                  onValueChange={(v) => {
                    setFormData((p) => ({ ...p, district: v, subDistrict: "" }));
                    const found = districtOptions.find((d) => d.name === v);
                    setSubdistrictOptions(found ? found.subdistricts : []);
                  }}
                >
                  <SelectTrigger className="h-12 border-emerald-100 bg-white/50 focus:ring-emerald-500">
                    <SelectValue placeholder={districtOptions.length ? "เลือกอำเภอ/เขต" : "รอรหัสไปรษณีย์"} />
                  </SelectTrigger>
                  <SelectContent>
                    {districtOptions.map((d) => (
                      <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label htmlFor="sub-district" className="text-emerald-900 text-base font-semibold">ตำบล/แขวง <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.subDistrict || undefined}
                  disabled={subdistrictOptions.length === 0}
                  onValueChange={(v) => setFormData((p) => ({ ...p, subDistrict: v }))}
                >
                  <SelectTrigger className="h-12 border-emerald-100 bg-white/50 focus:ring-emerald-500">
                    <SelectValue placeholder={subdistrictOptions.length ? "เลือกตำบล/แขวง" : "เลือกอำเภอก่อน"} />
                  </SelectTrigger>
                  <SelectContent>
                    {subdistrictOptions.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 md:col-span-2">
                <Label htmlFor="address" className="text-emerald-900 text-base font-semibold">รายละเอียดที่อยู่</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                  placeholder="บ้านเลขที่, หมู่บ้าน, ซอย, ถนน หรือจุดสังเกตสำคัญ"
                  rows={3}
                  className="resize-none border-emerald-100 bg-white/50 focus-visible:ring-emerald-500"
                />
              </div>

              <div className="space-y-4 md:col-span-2 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <Label className="text-emerald-900 text-base font-semibold">ปักหมุดตำแหน่ง</Label>
                </div>
                
                <div className="rounded-2xl overflow-hidden border-2 border-emerald-100 shadow-lg shadow-emerald-50">
                  <LocationPicker 
                    initialLat={formData.mapLink && formData.mapLink.includes('q=') ? parseFloat(formData.mapLink.split('q=')[1].split(',')[0]) : undefined}
                    initialLng={formData.mapLink && formData.mapLink.includes('q=') ? parseFloat(formData.mapLink.split('q=')[1].split(',')[1]) : undefined}
                    onLocationSelect={(lat, lng) => {
                       void handleLocationSelect(lat, lng);
                    }}
                    addressQuery={[formData.subDistrict, formData.district, formData.province]
                        .filter(Boolean)
                        .join(" ")}
                  />
                </div>
                <p className="text-center text-sm text-emerald-600/70">
                  * ช่วยให้ทีมงานเดินทางไปถึงบ้านคุณได้อย่างถูกต้องแม่นยำ
                </p>
              </div>
            </div>
          </div>
        );

      case 2: // Garden
        return (
          <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
            {/* Measurement Option */}
            <div 
              onClick={() => setFormData(p => ({ 
                ...p, 
                needMeasurement: !p.needMeasurement,
                gardenArea: !p.needMeasurement ? "" : "",
                gardenWidth: !p.needMeasurement ? "" : "",
                gardenLength: !p.needMeasurement ? "" : ""
              }))}
              className={cn(
                "cursor-pointer relative overflow-hidden rounded-2xl border-2 transition-all duration-300 p-6 flex flex-col md:flex-row items-center justify-between gap-4",
                formData.needMeasurement 
                  ? "border-emerald-500 bg-emerald-50 shadow-md" 
                  : "border-gray-100 bg-white hover:border-emerald-200"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-full transition-colors",
                  formData.needMeasurement ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
                )}>
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className={cn("font-semibold text-lg", formData.needMeasurement ? "text-emerald-900" : "text-gray-900")}>
                    ยังไม่ทราบขนาดพื้นที่?
                  </h4>
                  <p className="text-sm text-gray-500">ให้ทีมงานของเราเข้าไปวัดพื้นที่หน้างานให้คุณ</p>
                </div>
              </div>
              <Switch
                checked={formData.needMeasurement}
                onCheckedChange={(checked) =>
                  setFormData((p) => ({
                    ...p,
                    needMeasurement: checked,
                    ...(checked ? { gardenArea: "", gardenWidth: "", gardenLength: "" } : null),
                  }))
                }
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>

            <div className={cn(
              "space-y-6 transition-all duration-500",
              formData.needMeasurement ? "opacity-30 pointer-events-none grayscale" : "opacity-100"
            )}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="garden-area" className="text-emerald-900 font-medium">ขนาดรวม (ตร.ม.)</Label>
                  <div className="relative">
                    <Input
                      id="garden-area"
                      type="number"
                      min={0}
                      value={formData.gardenArea}
                      onChange={(e) => setFormData((p) => ({ ...p, gardenArea: e.target.value }))}
                      placeholder="เช่น 50"
                      className="h-12 text-center text-lg font-medium border-emerald-100 focus-visible:ring-emerald-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">ตร.ม.</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="garden-width" className="text-emerald-900 font-medium">ความกว้าง (เมตร)</Label>
                  <div className="relative">
                    <Input
                      id="garden-width"
                      type="number"
                      min={0}
                      step={0.1}
                      value={formData.gardenWidth}
                      onChange={(e) => setFormData((p) => ({ ...p, gardenWidth: e.target.value }))}
                      placeholder="กว้าง"
                      className="h-12 text-center text-lg font-medium border-emerald-100 focus-visible:ring-emerald-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">ม.</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="garden-length" className="text-emerald-900 font-medium">ความยาว (เมตร)</Label>
                  <div className="relative">
                    <Input
                      id="garden-length"
                      type="number"
                      min={0}
                      step={0.1}
                      value={formData.gardenLength}
                      onChange={(e) => setFormData((p) => ({ ...p, gardenLength: e.target.value }))}
                      placeholder="ยาว"
                      className="h-12 text-center text-lg font-medium border-emerald-100 focus-visible:ring-emerald-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">ม.</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-emerald-100/50" />

            <div className="space-y-4">
              <Label className="text-emerald-900 text-base font-semibold flex items-center gap-2">
                <Dog className="w-5 h-5 text-emerald-600" />
                ข้อมูลสัตว์เลี้ยง
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PET_TYPES.map((pt) => {
                  const Icon = pt.icon;
                  const isSelected = formData.petInfo === pt.id;
                  return (
                    <div
                      key={pt.id}
                      onClick={() => setFormData(p => ({ ...p, petInfo: pt.id }))}
                      className={cn(
                        "cursor-pointer flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300",
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md scale-[1.02]"
                          : "border-gray-100 bg-white text-gray-500 hover:border-emerald-200 hover:bg-emerald-50/30"
                      )}
                    >
                      <Icon className={cn("w-8 h-8", isSelected ? "text-emerald-600" : "text-gray-400")} />
                      <span className="font-medium">{pt.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 3: // Time
        return (
          <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
            
            {/* Date Selection */}
            <div className="space-y-5">
              <Label className="text-emerald-900 text-lg font-semibold flex items-center gap-2">
                <CalendarRange className="w-5 h-5 text-emerald-600" />
                วันที่สะดวกให้เข้าบริการ
              </Label>
              <p className="text-sm text-gray-500 -mt-3">เลือกอย่างน้อย 1 วัน</p>
              
              <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                {daysOfWeek.map((day) => {
                  const isSelected = safeServiceDays.includes(day.id);
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => {
                          const current = prev.serviceDays || [];
                          if (current.includes(day.id)) {
                            return { ...prev, serviceDays: current.filter((d) => d !== day.id) };
                          } else {
                            const dayOrder = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
                            const newDays = [...current, day.id].sort(
                              (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
                            );
                            return { ...prev, serviceDays: newDays };
                          }
                        });
                      }}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all duration-300 aspect-[4/5] md:aspect-square group",
                        isSelected
                          ? "border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-200 transform scale-105"
                          : "border-gray-100 bg-white text-gray-400 hover:border-emerald-200 hover:bg-emerald-50"
                      )}
                    >
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-wider mb-1",
                        isSelected ? "text-emerald-100" : "text-gray-400 group-hover:text-emerald-500"
                      )}>
                        {day.id.substring(0, 3)}
                      </span>
                      <span className="text-xl md:text-2xl font-bold">{day.label}</span>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-emerald-100/50" />

            {/* Time Selection */}
            <div className="space-y-5">
              <Label className="text-emerald-900 text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                ช่วงเวลาที่สะดวก
              </Label>
              
              <div className="relative bg-white rounded-2xl border-2 border-emerald-100/50 p-2 shadow-sm">
                <div className="flex items-center justify-between gap-4 p-4">
                  <div className="flex-1 space-y-2 text-center">
                    <Label className="text-xs text-emerald-600 font-bold uppercase tracking-wider">ตั้งแต่</Label>
                    <div className="relative group">
                      <Input
                        type="time"
                        step={1800}
                        min="06:00"
                        max="19:00"
                        value={formData.serviceWindowStart}
                        onChange={(e) => {
                          const v = e.target.value;
                          setFormData((p) => {
                            const endMin = p.serviceWindowEnd ? toMinutes(p.serviceWindowEnd) : null;
                            const startMin = v ? toMinutes(v) : null;
                            const shouldClearEnd = endMin != null && startMin != null && endMin <= startMin;
                            return {
                              ...p,
                              serviceWindowStart: v,
                              serviceWindowEnd: shouldClearEnd ? "" : p.serviceWindowEnd,
                            };
                          });
                        }}
                        className="h-14 text-center text-2xl font-bold border-emerald-100 bg-emerald-50/30 rounded-xl focus-visible:ring-emerald-500 focus-visible:bg-white transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="text-emerald-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>

                  <div className="flex-1 space-y-2 text-center">
                    <Label className="text-xs text-emerald-600 font-bold uppercase tracking-wider">ถึงเวลา</Label>
                    <div className="relative group">
                      <Input
                        type="time"
                        step={1800}
                        min={formData.serviceWindowStart || "06:00"}
                        max="19:00"
                        value={formData.serviceWindowEnd}
                        onChange={(e) => setFormData((p) => ({ ...p, serviceWindowEnd: e.target.value }))}
                        disabled={!formData.serviceWindowStart}
                        className="h-14 text-center text-2xl font-bold border-emerald-100 bg-emerald-50/30 rounded-xl focus-visible:ring-emerald-500 focus-visible:bg-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            {availabilityPreview && (
              <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-6 shadow-xl shadow-emerald-200/50 flex items-center justify-between text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <CalendarRange className="w-24 h-24" />
                  </div>
                  
                  <div className="space-y-1 relative z-10 w-full">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-emerald-100 text-xs font-bold uppercase tracking-widest border border-emerald-400/30 px-2 py-0.5 rounded-full bg-black/10">สรุปการนัดหมาย</span>
                       <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setFormData(p => ({ ...p, serviceWindowStart: "", serviceWindowEnd: "", serviceDays: [] }))}
                          className="h-6 w-6 text-emerald-200 hover:text-white hover:bg-white/20 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="text-lg md:text-xl font-medium leading-relaxed">
                      {availabilityPreview}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4]/60 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <Card className="border-0 shadow-2xl shadow-emerald-100/50 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl ring-1 ring-white/50">
          
          {/* Header */}
          <div className="bg-white/50 border-b border-emerald-100/50 p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-emerald-950 tracking-tight">เพิ่มบ้านใหม่</h1>
                <p className="text-emerald-600/70 mt-1">กรอกข้อมูลให้ครบถ้วนเพื่อเริ่มใช้บริการ</p>
              </div>
              {onCancel && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={onCancel} 
                  className="rounded-full h-10 w-10 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Custom Progress Stepper - Horizontal on Desktop */}
            <div className="relative mx-auto max-w-2xl px-4">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 rounded-full -translate-y-1/2 -z-10" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-emerald-500 rounded-full -translate-y-1/2 transition-all duration-500 ease-out -z-10"
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} 
              />
              
              <div className="flex justify-between items-center w-full">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;

                  return (
                    <div key={index} className="flex flex-col items-center gap-2 relative bg-white px-2 py-1 rounded-xl">
                      <div 
                        className={cn(
                          "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-sm",
                          isActive 
                            ? "border-emerald-100 bg-emerald-500 text-white scale-110 shadow-emerald-200" 
                            : isCompleted
                              ? "border-emerald-500 bg-white text-emerald-500"
                              : "border-gray-100 bg-white text-gray-300"
                        )}
                      >
                       {isCompleted ? <Check className="w-5 h-5 md:w-6 md:h-6" /> : <Icon className="w-5 h-5 md:w-6 md:h-6" />}
                      </div>
                      <span className={cn(
                        "text-[10px] md:text-xs font-bold uppercase tracking-wider absolute -bottom-6 w-24 text-center transition-colors duration-300",
                        isActive ? "text-emerald-700" : isCompleted ? "text-emerald-600/60" : "text-gray-300"
                      )}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Spacer for labels */}
            <div className="h-6 md:h-4" /> 
          </div>

          <CardContent className="p-6 md:p-10 min-h-[400px]">
             {submitError && (
              <Alert variant="destructive" className="mb-8 bg-red-50 border-red-100 text-red-900 rounded-xl">
                <XCircle className="h-5 w-5" />
                <AlertTitle className="font-bold">เกิดข้อผิดพลาด</AlertTitle>
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {renderStepContent()}
          </CardContent>

          <CardFooter className="flex justify-between items-center border-t border-emerald-100/50 bg-emerald-50/30 p-6 md:px-10 md:py-8 backdrop-blur-sm">
             <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
                className={cn(
                  "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100/50 px-6",
                  currentStep === 0 && "invisible"
                )}
             >
               <ArrowLeft className="w-5 h-5 mr-2" />
               ย้อนกลับ
             </Button>

             <div className="flex items-center gap-4">
               {/* Step Indicator Text (Mobile) */}
               <span className="text-xs text-emerald-600/50 font-medium md:hidden">
                 ขั้นตอนที่ {currentStep + 1}/{STEPS.length}
               </span>

               <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all px-8 py-6 h-auto text-base"
               >
                 {isSubmitting ? (
                   <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>กำลังบันทึก...</span>
                   </div>
                 ) : currentStep === STEPS.length - 1 ? (
                   <>
                     บันทึกข้อมูล
                     <CheckCircle2 className="w-5 h-5 ml-2" />
                   </>
                 ) : (
                   <>
                     ถัดไป
                     <ArrowRight className="w-5 h-5 ml-2" />
                   </>
                 )}
               </Button>
             </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
