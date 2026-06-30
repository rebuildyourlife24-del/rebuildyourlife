import { getIntegrations } from '@/actions/integrations';
import { SettingsIntegrationsClient } from './SettingsIntegrationsClient';

export default async function SettingsIntegrationsPage() {
  const integrations = await getIntegrations();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">API Integraties</h3>
        <p className="text-sm text-gray-400">
          Koppel externe diensten zodat de Hermes Omnibus autonoom acties kan uitvoeren. Geen code nodig, alleen je tokens.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-black/50 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Autonome Marketing</h3>
            <p className="text-sm text-gray-400">Meta Ads en TikTok API koppelingen.</p>
          </div>
          <div className="space-y-6">
             <SettingsIntegrationsClient 
                provider="META_ADS" 
                title="Meta (Facebook) Ads" 
                description="Token nodig om budgetten te scalen op ROAS"
                existingIntegration={integrations.find(i => i.provider === 'META_ADS')}
             />
             <div className="border-t border-white/10" />
             <SettingsIntegrationsClient 
                provider="TIKTOK_ADS" 
                title="TikTok Marketing" 
                description="Token nodig om deepfakes autonoom live te zetten"
                existingIntegration={integrations.find(i => i.provider === 'TIKTOK_ADS')}
             />
          </div>
        </div>

        <div className="bg-black/50 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Supply Chain & Operaties</h3>
            <p className="text-sm text-gray-400">Leveranciers en Klantenservice koppelingen.</p>
          </div>
          <div className="space-y-6">
             <SettingsIntegrationsClient 
                provider="CJ_DROPSHIPPING" 
                title="CJ Dropshipping API" 
                description="Zodat Hermes autonoom bestellingen kan omleiden bij vertraging."
                existingIntegration={integrations.find(i => i.provider === 'CJ_DROPSHIPPING')}
             />
             <div className="border-t border-white/10" />
             <SettingsIntegrationsClient 
                provider="IMAP_SUPPORT" 
                title="Gmail / IMAP Support" 
                description="Wachtwoord om Hermes e-mails te laten afhandelen."
                existingIntegration={integrations.find(i => i.provider === 'IMAP_SUPPORT')}
             />
          </div>
        </div>
      </div>
    </div>
  );
}
