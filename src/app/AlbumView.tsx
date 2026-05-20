'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Sticker = {
  id: string;
  code: string;
  name: string;
  is_foil: boolean;
};

type Section = {
  id: string;
  name: string;
  code: string;
  color_primary: string;
  flag_emoji: string;
  stickers: Sticker[];
};

type UserSticker = {
  sticker_id: string;
  status: 'owned' | 'repeated' | 'wanted';
  quantity: number;
};

export default function AlbumView({
  sections,
  initialUserStickers,
  isLoggedIn
}: {
  sections: Section[];
  initialUserStickers: UserSticker[];
  isLoggedIn: boolean;
}) {
  const [userStickers, setUserStickers] = useState<Record<string, UserSticker>>(
    initialUserStickers.reduce((acc, us) => {
      acc[us.sticker_id] = us;
      return acc;
    }, {} as Record<string, UserSticker>)
  );
  
  const supabase = createClient();

  const handleStickerClick = async (stickerId: string) => {
    if (!isLoggedIn) {
      alert('Debes iniciar sesión para marcar tus figuritas');
      return;
    }

    const currentStatus = userStickers[stickerId]?.status || 'wanted';
    
    // Cycle through states: wanted -> owned -> repeated
    let newStatus: 'owned' | 'repeated' | 'wanted' = 'owned';
    if (currentStatus === 'wanted') newStatus = 'owned';
    else if (currentStatus === 'owned') newStatus = 'repeated';
    else newStatus = 'wanted';

    // Optimistic update
    const updatedSticker = {
      sticker_id: stickerId,
      status: newStatus,
      quantity: newStatus === 'repeated' ? 1 : 1
    };
    
    setUserStickers(prev => ({
      ...prev,
      [stickerId]: updatedSticker
    }));

    // Perform the update in Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    if (newStatus === 'wanted') {
      // Remove from table or set status to wanted (schema says default is wanted, but we can store it or delete it)
      // Usually it's better to delete it to save space, but schema allows 'wanted' status.
      await supabase.from('user_stickers').upsert({
        user_id: session.user.id,
        sticker_id: stickerId,
        status: 'wanted',
        quantity: 1
      }, { onConflict: 'user_id, sticker_id' });
    } else {
      await supabase.from('user_stickers').upsert({
        user_id: session.user.id,
        sticker_id: stickerId,
        status: newStatus,
        quantity: updatedSticker.quantity
      }, { onConflict: 'user_id, sticker_id' });
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {sections.map(section => (
        <div key={section.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div 
            className="px-6 py-4 flex items-center gap-3 text-white"
            style={{ backgroundColor: section.color_primary || '#1a73e8' }}
          >
            <span className="text-3xl">{section.flag_emoji}</span>
            <h2 className="text-2xl font-bold tracking-tight">{section.name}</h2>
            <span className="ml-auto font-mono text-sm opacity-80 bg-black/20 px-3 py-1 rounded-full">
              {section.code}
            </span>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3">
              {section.stickers.map(sticker => {
                const status = userStickers[sticker.id]?.status || 'wanted';
                
                return (
                  <button
                    key={sticker.id}
                    onClick={() => handleStickerClick(sticker.id)}
                    className={`
                      relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-200
                      ${status === 'wanted' ? 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300' : ''}
                      ${status === 'owned' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : ''}
                      ${status === 'repeated' ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : ''}
                      ${sticker.is_foil ? 'shadow-[0_0_15px_rgba(200,169,81,0.2)]' : ''}
                    `}
                  >
                    <span className="font-mono font-bold text-sm">{sticker.code}</span>
                    <span className="text-[10px] text-center truncate w-full mt-1 opacity-70">
                      {sticker.name.split('-')[0].trim()}
                    </span>
                    
                    {/* Badge for repeated */}
                    {status === 'repeated' && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                        +1
                      </div>
                    )}
                    
                    {/* Foil indicator */}
                    {sticker.is_foil && (
                      <div className="absolute -bottom-1 -left-1 text-[10px]">✨</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
