import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function ProfilePage({ params }: { params: { share_token: string } }) {
  const supabase = await createClient();
  const token = params.share_token;

  // Fetch the user by share_token
  const { data: user } = await supabase
    .from('users')
    .select('id, username, display_name, avatar_url, city, country')
    .eq('share_token', token)
    .single();

  if (!user) {
    notFound();
  }

  // Fetch their repeated and wanted stickers
  const { data: stickersData } = await supabase
    .from('user_stickers')
    .select('status, quantity, stickers(code, name, is_foil, sections(name, flag_emoji))')
    .eq('user_id', user.id)
    .in('status', ['repeated', 'wanted']);

  const repeated = stickersData?.filter(s => s.status === 'repeated') || [];
  const wanted = stickersData?.filter(s => s.status === 'wanted') || [];

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-[#8A1538] text-white p-8 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
            {user.display_name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{user.display_name}</h1>
          <p className="text-white/80 mt-2">
            @{user.username} • {user.city || 'Desconocida'}, {user.country}
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 mt-8 grid md:grid-cols-2 gap-8">
        {/* REPEATED */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-700">
            <span>Repetidas</span>
            <span className="text-sm bg-green-100 px-3 py-1 rounded-full">{repeated.length}</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {repeated.map((s, idx) => {
              const sticker = Array.isArray(s.stickers) ? s.stickers[0] : s.stickers;
              if (!sticker) return null;
              
              return (
                <div key={idx} className="bg-green-50 border border-green-200 p-2 rounded-xl flex flex-col items-center justify-center relative">
                  <span className="font-mono font-bold text-sm">{sticker.code}</span>
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                    {s.quantity}
                  </div>
                </div>
              );
            })}
            {repeated.length === 0 && (
              <div className="col-span-full text-gray-400 text-center py-4">No tiene repetidas.</div>
            )}
          </div>
        </section>

        {/* WANTED */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-red-700">
            <span>Faltantes</span>
            <span className="text-sm bg-red-100 px-3 py-1 rounded-full">{wanted.length}</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {wanted.map((s, idx) => {
              const sticker = Array.isArray(s.stickers) ? s.stickers[0] : s.stickers;
              if (!sticker) return null;
              
              return (
                <div key={idx} className="bg-gray-50 border border-gray-200 p-2 rounded-xl flex flex-col items-center justify-center">
                  <span className="font-mono font-bold text-sm text-gray-600">{sticker.code}</span>
                </div>
              );
            })}
            {wanted.length === 0 && (
              <div className="col-span-full text-gray-400 text-center py-4">¡Álbum completo o sin registrar!</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
