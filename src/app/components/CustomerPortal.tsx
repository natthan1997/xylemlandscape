import React, { useState, useEffect } from 'react';
import {
  Home,
  Calendar,
  Clock,
  Settings,
  LogOut,
  User,
  Bell,
  Menu,
  X,
  ChevronRight,
  Leaf,
  Star,
  BarChart3,
  FileText,
  Trees,
  ShoppingBag,
} from 'lucide-react';
import { CustomerDashboard } from './CustomerDashboard';
import { CustomerAppointments } from './CustomerAppointments';
import { CustomerHistory } from './CustomerHistory';
import { CustomerProfile } from './CustomerProfile';
import { CustomerSettings } from './CustomerSettings';
import { PropertySettings } from './PropertySettings';
import { CustomerReports } from './CustomerReports';
import { ServiceDetailModal } from './ServiceDetailModal';
import { PropertyList } from './PropertyList';
import { PropertySetupForm } from './PropertySetupForm';
import { ServiceDetail } from './ServiceDetail';
import { PlantShop } from './PlantShop';
import { ServiceSelection } from './ServiceSelection';

interface CustomerPortalProps {
  customer: any;
  onLogout: () => void;
  properties?: any[];
  selectedProperty?: any;
  onPropertySelect?: (property: any) => void;
  onViewService?: (service: any) => void;
  onCreateProperty?: (data: any) => Promise<void>;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  customer,
  onLogout,
  properties = [],
  selectedProperty,
  onPropertySelect,
  onViewService,
  onCreateProperty,
}) => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
  const [showServiceSelection, setShowServiceSelection] = useState(false);
  const [selectedServiceData, setSelectedServiceData] = useState<any>(null);

  // Auto open/close sidebar based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false); // Mobile: ซ่อน sidebar by default
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ถ้ายังไม่มีบริการ ให้แสดงหน้าเลือกบริการ
  useEffect(() => {
    if (properties.length === 0 && !showServiceSelection && !showAddPropertyForm) {
      setShowServiceSelection(true);
    }
  }, [properties.length, showServiceSelection, showAddPropertyForm]);

  const menuItems = [
    { id: 'home', label: 'หน้าหลัก', icon: Home },
    { id: 'properties', label: 'บ้านของฉัน', icon: Trees },
    { id: 'plantshop', label: 'ช้อปปิ้งต้นไม้', icon: ShoppingBag },
    { id: 'appointments', label: 'นัดหมาย', icon: Calendar },
    { id: 'history', label: 'ประวัติ', icon: FileText },
    { id: 'reports', label: 'รายงาน', icon: BarChart3 },
    { id: 'profile', label: 'โปรไฟล์', icon: User },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // ใช้ข้อมูลจากบ้านที่เลือก หรือบ้านแรกถ้ายังไม่ได้เลือก
  const currentProperty = selectedProperty || properties?.[0];
  
  // รวมข้อมูลลูกค้ากับข้อมูลบ้านปัจจุบัน
  const safeCustomer = customer && typeof customer === 'object' ? customer : {};
  const displayCustomer = {
    ...(currentProperty ?? {}),
    ...safeCustomer,
    // ถ้ามี plantHealth และ serviceHistory จากบ้าน ให้ใช้ข้อมูลนั้น
    plantHealth: currentProperty?.plantHealth || (safeCustomer as any)?.plantHealth || [],
    serviceHistory: currentProperty?.serviceHistory || (safeCustomer as any)?.serviceHistory || [],
  };

  return (
    <div className="min-h-screen bg-gray-50 flex max-w-full overflow-hidden">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Leaf size={18} className="text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900">XYLEM</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Menu Items - Clean with Green */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:bg-emerald-50'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Footer - Minimal */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-900 font-medium transition"
            >
              <LogOut size={18} />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen bg-gray-50 overflow-x-hidden max-w-full">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-3 py-3 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900">XYLEM LANDSCAPE</span>
          </div>
          
          <button 
            onClick={() => handleTabChange('settings')}
            className="p-2 hover:bg-emerald-50 rounded-lg transition"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </header>

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20 md:block hidden">
          <div className="px-4 md:px-8 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-emerald-50 rounded-lg transition"
                >
                  <Menu size={20} className="text-gray-600" />
                </button>
                <div>
                  <h2 className="font-bold text-lg text-gray-900">
                    {menuItems.find(item => item.id === activeTab)?.label || 'หน้าหลัก'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedProperty?.name || 'สวนของคุณ'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-emerald-50 rounded-lg transition relative">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                  {String((safeCustomer as any)?.name || 'ลูกค้า')
                    .split(' ')
                    .filter(Boolean)
                    .map((n: string) => n[0])
                    .join('')}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหา..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 pb-24 md:pb-8">
          {activeTab === 'home' && (
            <CustomerDashboard 
              customer={displayCustomer}
              onViewService={(service) => setSelectedService(service)}
              onNavigate={setActiveTab}
              properties={properties}
              selectedProperty={selectedProperty}
              onPropertySelect={onPropertySelect}
              onAddProperty={() => setShowAddPropertyForm(true)}
            />
          )}
          {activeTab === 'properties' && (
            <PropertyList
              properties={properties}
              selectedProperty={selectedProperty}
              onPropertySelect={onPropertySelect}
              onAddProperty={() => setShowAddPropertyForm(true)}
              onBack={() => setActiveTab('home')}
            />
          )}
          {activeTab === 'appointments' && (
            <CustomerAppointments customer={displayCustomer} />
          )}
          {activeTab === 'history' && (
            <CustomerHistory 
              customer={displayCustomer}
              onViewService={(service) => setSelectedService(service)}
            />
          )}
          {activeTab === 'profile' && (
            <CustomerProfile 
              customer={displayCustomer}
              onNavigateToSettings={() => setActiveTab('settings')}
              onLogout={onLogout}
            />
          )}
          {activeTab === 'settings' && (
            <PropertySettings 
              property={currentProperty} 
              onSave={(data) => console.log('Save property:', data)}
              onDelete={() => console.log('Delete property')}
            />
          )}
          {activeTab === 'reports' && (
            <CustomerReports customer={displayCustomer} />
          )}
          {activeTab === 'plantshop' && (
            <PlantShop />
          )}
        </div>
      </main>

      {/* Service Detail Modal - Full Screen Overlay */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <ServiceDetail
            service={selectedService}
            onBack={() => setSelectedService(null)}
            onBookService={() => {
              setSelectedService(null);
              setActiveTab('appointments');
            }}
          />
        </div>
      )}

      {/* Service Selection Modal - แสดงเมื่อยังไม่มีบริการ */}
      {showServiceSelection && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <ServiceSelection
            onComplete={(serviceData) => {
              setSelectedServiceData(serviceData);
              setShowServiceSelection(false);
              setShowAddPropertyForm(true);
            }}
            onBack={properties.length > 0 ? () => setShowServiceSelection(false) : undefined}
          />
        </div>
      )}

      {/* Add Property Form Modal */}
      {showAddPropertyForm && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <PropertySetupForm
            onComplete={async (data) => {
              // รวมข้อมูลบริการที่เลือกไว้ด้วย
              const propertyData = selectedServiceData 
                ? { ...data, selectedService: selectedServiceData }
                : data;
              
              await onCreateProperty?.(propertyData);
              setShowAddPropertyForm(false);
              setSelectedServiceData(null);
              setActiveTab('home');
            }}
            onCancel={() => {
              if (properties.length === 0) {
                // ถ้ายังไม่มีบริการเลย กลับไปหน้าเลือกบริการ
                setShowAddPropertyForm(false);
                setShowServiceSelection(true);
              } else {
                // ถ้ามีบริการแล้ว แค่ปิด form
                setShowAddPropertyForm(false);
              }
            }}
            selectedService={selectedServiceData}
          />
        </div>
      )}
    </div>
  );
};