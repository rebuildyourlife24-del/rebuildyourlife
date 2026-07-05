import { getEventsAction } from '@/app/actions/community';
import { Card } from '@/components/ui/Card';
import { Map, Calendar, Clock, Video, Users, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const result = await getEventsAction();
  const events = result.success && result.events ? result.events : [];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20 font-sans h-full px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Widget */}
      <div className="relative overflow-hidden rounded-[2rem] border border-blue-500/20 glass-cyber p-8 md:p-12 group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-1000"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Map className="w-3 h-3 mr-2" />
                Live Events
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              Netwerk <span className="text-blue-400">Evenementen</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl font-light">
              Fysieke meetups, live Q&A's, en online masterclasses. Sluit je aan bij de sessies om direct in contact te komen met experts en mede-ondernemers.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event: any) => {
          const isOnline = event.location.toLowerCase().includes('online') || event.location.toLowerCase().includes('zoom') || event.location.includes('http');
          const startDate = new Date(event.startDate);
          
          return (
            <div key={event.id} className="glass-cyber rounded-[1.5rem] overflow-hidden flex flex-col hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] border border-white/5 hover:border-blue-500/30 transition-all group">
              
              {/* Event Date Block */}
              <div className="bg-[#050505] p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/30 flex flex-col items-center justify-center text-blue-400">
                    <span className="text-xs font-bold uppercase">{format(startDate, 'MMM', { locale: nl })}</span>
                    <span className="text-xl font-black leading-none">{format(startDate, 'dd')}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white line-clamp-1">{event.title}</h3>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {format(startDate, 'HH:mm')} 
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-sm text-zinc-400 mb-6 flex-1 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-zinc-300 bg-white/5 p-3 rounded-lg border border-white/5">
                    {isOnline ? <Video className="w-4 h-4 text-blue-400 shrink-0" /> : <Map className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span className="truncate">{event.location}</span>
                  </div>
                  {event.maxAttendees && (
                    <div className="flex items-center gap-3 text-sm text-zinc-300 bg-white/5 p-3 rounded-lg border border-white/5">
                      <Users className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>Max {event.maxAttendees} plekken</span>
                    </div>
                  )}
                </div>

                <a 
                  href={isOnline && event.location.includes('http') ? event.location : '#'} 
                  target={isOnline && event.location.includes('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  {isOnline ? 'Join Sessie' : 'Bekijk Locatie'}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="col-span-full py-20 text-center border border-white/10 border-dashed rounded-[2rem] bg-white/5">
            <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Geen opkomende evenementen</h3>
            <p className="text-zinc-500">Houd de kalender in de gaten voor nieuwe Q&A's en meetups.</p>
          </div>
        )}
      </div>

    </div>
  );
}
