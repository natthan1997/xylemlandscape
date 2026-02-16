import React, { lazy, Suspense } from 'react';

interface LocationPickerProps {
    initialLat?: number;
    initialLng?: number;
    onLocationSelect: (lat: number, lng: number) => void;
    addressQuery?: string;
}

const LocationPickerWrapper = lazy(() => import('./LocationPickerWrapper'));

export const LocationPicker: React.FC<LocationPickerProps> = (props) => {
    return (
        <Suspense fallback={<div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Loading Map...</div>}>
            <LocationPickerWrapper {...props} />
        </Suspense>
    );
};

