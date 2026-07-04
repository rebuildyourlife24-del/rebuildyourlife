import { prisma } from '@rebuildyourlife/database';
import { Building, Folder, FileText, Globe } from 'lucide-react';

export default async function EnterprisePage() {
  const folders = await prisma.enterpriseFolder.findMany({
    include: {
      documents: true
    }
  });

  const projects = await prisma.project.findMany();

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <Building className="w-8 h-8 text-cyan-500" />
          SaaS & Enterprise
        </h1>
        <p className="text-zinc-400 font-mono text-sm">Jouw actieve SaaS projecten en enterprise documentatie (LIVE DATA).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects / SaaS instances */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-500" /> SaaS Projecten
          </h2>
          {projects.length === 0 ? (
            <div className="border border-white/10 bg-black/40 p-6 rounded-xl text-center">
              <p className="text-zinc-500 text-sm">Geen actieve projecten of domeinen geregistreerd.</p>
            </div>
          ) : (
            projects.map(proj => (
              <div key={proj.id} className="border border-white/10 bg-black/40 p-5 rounded-xl hover:border-cyan-500/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-lg">{proj.name}</h3>
                  {proj.isHolding && (
                    <span className="text-[10px] px-2 py-1 rounded-full uppercase font-mono bg-purple-500/10 text-purple-400">
                      HOLDING
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-2">
                    Industry: <span className="text-zinc-300">{proj.industry}</span>
                  </span>
                  {proj.domainUrl && (
                    <span className="text-xs font-mono text-cyan-400 uppercase flex items-center gap-2">
                      URL: <a href={`https://${proj.domainUrl}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.domainUrl}</a>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Enterprise Folders / Docs */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-2">
            <Folder className="w-5 h-5 text-cyan-500" /> Kennisbank & Documenten
          </h2>
          {folders.length === 0 ? (
            <div className="border border-white/10 bg-black/40 p-6 rounded-xl text-center">
              <p className="text-zinc-500 text-sm">Geen enterprise folders gevonden.</p>
            </div>
          ) : (
            folders.map(folder => (
              <div key={folder.id} className="border border-white/10 bg-black/40 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Folder className="w-4 h-4 text-zinc-400" /> {folder.name}
                  </h3>
                </div>
                <div className="p-4 bg-black">
                  {folder.documents.length === 0 ? (
                    <p className="text-xs text-zinc-600">Geen documenten in deze map.</p>
                  ) : (
                    <div className="space-y-2">
                      {folder.documents.map(doc => (
                        <div key={doc.id} className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors border border-transparent hover:border-white/10">
                          <div className="flex items-center gap-2">
                            <FileText className="w-3 h-3 text-cyan-500" />
                            <span className="text-xs text-zinc-300 font-medium">{doc.title}</span>
                          </div>
                          <span className={`text-[8px] uppercase px-1.5 py-0.5 rounded ${doc.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
