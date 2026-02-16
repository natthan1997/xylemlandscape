'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Locate, Search, Loader2, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
    initialLat?: number;
    initialLng?: number;
    onLocationSelect: (lat: number, lng: number) => void;
}

// Component to handle map movement and clicks
const MapController = ({ 
    position, 
    setPosition, 
    onLocationSelect, 
    addressQuery
}: { 
    position: [number, number] | null, 
    setPosition: (pos: [number, number]) => void,
    onLocationSelect: (lat: number, lng: number) => void,
    addressQuery?: string
}) => {
    const map = useMap();

    // Handle map clicks
    useMapEvents({
        click(e) {
            const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
            setPosition(newPos);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    // Fly to position when it changes
    useEffect(() => {
        if (position) {
            map.flyTo(position, 16, { animate: true });
        }
    }, [position, map]);

    // Handle address query changes
    useEffect(() => {
        if (addressQuery) {
            // Using a debounce effectively by cancelling previous fetch if needed, 
            // but for simplicity here we just fire it. 
            // In a real app, you might want to debounce this in the parent or here.
            
             // Check if the current position is already close to this query? No, just search.
             const search = async () => {
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&limit=1`);
                    const data = await response.json();
                    if (data && data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);
                        
                        // Only update if significantly different to avoid subtle jumps?
                        // Or just update.
                        const newPos: [number, number] = [lat, lon];
                        setPosition(newPos);
                        onLocationSelect(lat, lon);
                    }
                } catch (e) {
                    console.error("Auto-locate by address failed", e);
                }
             };

             // Small timeout to avoid rapid firing if user is typing fast, though usually this comes from select
             const timer = setTimeout(search, 1000);
             return () => clearTimeout(timer);
        }
    }, [addressQuery]);

    // Auto-locate on mount if no position is set
    useEffect(() => {
        if (!position) {
            map.locate().on("locationfound", function (e) {
                const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
                setPosition(newPos);
                onLocationSelect(e.latlng.lat, e.latlng.lng);
                // MapController flyTo effect will handle the zoom
            });
        }
    }, [map]); 

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

const LocationPickerWrapper: React.FC<LocationPickerProps & { addressQuery?: string }> = ({ initialLat, initialLng, onLocationSelect, addressQuery }) => {
    
    // Default to Bangkok if no initial location
    const defaultCenter: [number, number] = [13.7563, 100.5018];
    const [position, setPosition] = useState<[number, number] | null>(
        initialLat && initialLng ? [initialLat, initialLng] : null
    );

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
            const data = await response.json();

            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                const newPos: [number, number] = [lat, lon];
                
                setPosition(newPos);
                onLocationSelect(lat, lon);
            } else {
                alert('ไม่พบสถานที่นี้ ลองค้นหาด้วยชื่ออื่น');
            }
        } catch (error) {
            console.error('Search error:', error);
            alert('เกิดข้อผิดพลาดในการค้นหา');
        } finally {
            setIsSearching(false);
        }
    };

    const handleGetCurrentLocation = () => {
         if (navigator.geolocation) {
            setIsSearching(true); // Reuse loading state for UI feedback
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const newPos: [number, number] = [latitude, longitude];
                    setPosition(newPos);
                    onLocationSelect(latitude, longitude);
                    setIsSearching(false);
                },
                (err) => {
                    console.error(err);
                    alert("ไม่สามารถระบุตําแหน่งได้ กรุณาเปิด Location Service");
                    setIsSearching(false);
                }
            );
        } else {
            alert("Browser ของคุณไม่รองรับการระบุตําแหน่ง");
        }
    };

    return (
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden border border-slate-200 z-0">
             {/* Map Component */}
             <MapContainer 
                center={position || defaultCenter} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false} 
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController 
                    position={position} 
                    setPosition={setPosition} 
                    onLocationSelect={onLocationSelect} 
                    addressQuery={addressQuery}
                />
            </MapContainer>
            
            {/* Search Bar Overlay */}
            <div className="absolute top-4 left-4 right-4 z-[1000]">
                <form onSubmit={handleSearch} className="flex gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg max-w-md mx-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ค้นหาสถานที่..." 
                            className="pl-9 bg-white border-slate-200 focus-visible:ring-emerald-500 h-9"
                        />
                    </div>
                    <Button 
                        type="submit" 
                        size="sm" 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                        disabled={isSearching}
                    >
                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ค้นหา'}
                    </Button>
                </form>
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
                 <Button
                    type="button"
                    size="icon"
                    className="bg-white text-slate-800 shadow-md hover:bg-slate-50 border border-slate-200 w-10 h-10 rounded-full"
                    onClick={handleGetCurrentLocation}
                    title="ตําแหน่งปัจจุบัน"
                 >
                    <Locate className="w-5 h-5 text-emerald-600" />
                 </Button>
            </div>

            {/* Helper Text */}
             {!position && (
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm z-[1000] flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    แตะบนแผนที่เพื่อปักหมุด
                 </div>
             )}
        </div>
    );
};

export default LocationPickerWrapper;

