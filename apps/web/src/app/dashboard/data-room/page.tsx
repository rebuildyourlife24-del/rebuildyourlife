'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { 
  Database, FileText, Upload, Lock, ShieldAlert,
  Search, Plus, MoreVertical, BrainCircuit, HardDrive
} from 'lucide-react';
import { getEnterpriseFolders, createDocument } from '@/actions/data-room';

export default function EnterpriseDataRoom() {
  const auth = useRequireAuth();
  const router = useRouter();
  
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isUploading, setIsUploading] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');

  useEffect(() => {
    if (auth.isAuthenticated && (auth.user?.subscriptionTier === 'ELITE' || auth.user?.role === 'SUPER_ADMIN')) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [auth.isAuthenticated, auth.user]);

  const fetchData = async () => {
    try {
      const data = await getEnterpriseFolders();
      setFolders(data);
      if (data.length > 0) {
        setSelectedFolder(data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle || !newDocContent || !selectedFolder) return;
    
    setIsUploading(true);
    try {
      await createDocument(selectedFolder, newDocTitle, newDocContent, auth.user?.firstName || 'Admin');
      setNewDocTitle('');
      setNewDocContent('');
      await fetchData();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return <div className="flex h-[80vh] items-center justify-center text-cyan-500"><BrainCircuit className="w-10 h-10 animate-spin" /></div>;
  }

  // Elite Gate
  if (auth.user?.subscriptionTier !== 'ELITE' && auth.user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center bg-black text-white">
        <ShieldAlert className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Classified Clearance Required</h1>
        <p className="text-gray-400 max-w-md mb-8">
          The Enterprise Data Room is highly classified. Alleen <strong>Elite Protocol</strong> leden kunnen bedrijfsgeheimen en SOP's uploaden voor de AI Swarm.
        </p>
        <button 
          onClick={() => router.push('/agency')}
          className="px-6 py-3 bg-red-900/50 hover:bg-red-800/80 text-red-200 border border-red-500/50 rounded-lg transition-colors font-medium"
        >
          Upgrade Clearance Level
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] p-6 text-white font-sans selection:bg-cyan-500/30 selection:text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-3">
            <HardDrive className="w-8 h-8 text-cyan-400" />
            Enterprise Data Room
          </h1>
          <p className="text-gray-400 mt-2 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            End-to-End Encrypted Corporate Memory
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Folders & Documents */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                Knowledge Base
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search memory..." 
                  className="bg-black/50 border border-zinc-800 rounded-lg py-1.5 pl-9 pr-4 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 transition-colors w-64"
                />
              </div>
            </div>

            {folders.length === 0 ? (
              <div className="text-center py-10 text-gray-500">Geen folders gevonden.</div>
            ) : (
              <div className="space-y-6">
                {folders.map(folder => (
                  <div key={folder.id} className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500/50"></div>
                      {folder.name}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {folder.documents.length === 0 ? (
                        <p className="text-xs text-gray-600 italic">Geen documenten in deze folder.</p>
                      ) : (
                        folder.documents.map((doc: any) => (
                          <div key={doc.id} className="bg-black/40 border border-zinc-800 rounded-lg p-4 hover:border-cyan-500/30 transition-colors group cursor-pointer">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-blue-400/70 p-1.5 bg-blue-500/10 rounded-md" />
                                <div>
                                  <h4 className="font-medium text-gray-200 group-hover:text-cyan-400 transition-colors line-clamp-1">{doc.title}</h4>
                                  <p className="text-xs text-gray-500 mt-0.5">Author: {doc.owner}</p>
                                </div>
                              </div>
                              <MoreVertical className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="mt-4 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                              <span className="px-2 py-0.5 bg-zinc-800 rounded text-cyan-400">{doc.category}</span>
                              <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upload */}
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-cyan-900/30 rounded-xl p-6 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Upload className="w-32 h-32 text-cyan-400" />
            </div>
            
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 relative z-10">
              <Plus className="w-5 h-5 text-cyan-400" />
              Feed The Swarm
            </h2>
            
            <form onSubmit={handleUpload} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Target Folder</label>
                <select 
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 transition-colors"
                >
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Document Title</label>
                <input 
                  type="text" 
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="e.g. Q3 Sales SOP" 
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Raw Text / Context</label>
                <textarea 
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  rows={8}
                  placeholder="Plak hier de ruwe tekst, bedrijfsregels of data. De AI Swarm zal dit direct in zijn geheugen opnemen..."
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none font-mono"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isUploading}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isUploading ? <BrainCircuit className="w-5 h-5 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploading ? 'Encrypting & Storing...' : 'Upload to Brain'}
              </button>
            </form>
          </div>
          
          <div className="bg-black/40 border border-zinc-800/50 rounded-xl p-5 text-sm text-gray-400">
            <h3 className="text-cyan-400 font-medium mb-2 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" />
              Hoe werkt dit?
            </h3>
            <p className="mb-2">Elk document dat je hier uploadt wordt direct toegevoegd aan het lange-termijn geheugen (RAG) van de C-Suite.</p>
            <p>Wanneer je met Hermes of Orion praat in de Boardroom, zullen zij deze regels en data meenemen in hun berekeningen.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
