import { getIntegrations, getSocialIntegrations } from '@/actions/integrations';
import { SettingsIntegrationsClient } from './SettingsIntegrationsClient';
import { SettingsSocialIntegrationsClient } from './SettingsSocialIntegrationsClient';
import { SettingsShopifyIntegrationsClient } from './SettingsShopifyIntegrationsClient';
import { getSessionAction } from '@/app/actions/auth';
import { prisma } from '@rebuildyourlife/database';

export default async function SettingsIntegrationsPage() {
  const integrations = await getIntegrations();
  const socialIntegrations = await getSocialIntegrations();
  const session = await getSessionAction();
  const user = session?.user;
  
  let shopifyStores: any[] = [];
  if (user) {
    shopifyStores = await prisma.shopifyStore.findMany({
      where: { userId: user.id },
      select: { id: true, shopUrl: true, status: true }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">API Integraties & Socials</h3>
        <p className="text-sm text-gray-400">
          Koppel externe diensten zodat de Sovereign Grid autonoom acties kan uitvoeren. Geen code nodig, alleen je tokens.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-black/50 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Social Media (Auto-Poster)</h3>
            <p className="text-sm text-gray-400">Jouw persoonlijke social media profielen.</p>
          </div>
          <div className="space-y-6">
             <SettingsSocialIntegrationsClient 
                platform="LINKEDIN" 
                title="LinkedIn Profile" 
                description="Vul je LinkedIn Access Token in om The Grid organisch te laten posten op je profiel."
                existingIntegration={socialIntegrations.find(i => i.platform === 'LINKEDIN')}
             />
             <div className="border-t border-white/10" />
             <SettingsSocialIntegrationsClient 
                platform="TWITTER" 
                title="X (Twitter) Profile" 
                description="Vul je X API sleutel in om autonoom content te syndicaten."
                existingIntegration={socialIntegrations.find(i => i.platform === 'TWITTER')}
             />
          </div>
        </div>

        <div className="bg-black/50 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Autonome Marketing (Ads)</h3>
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
                description="Zodat The Grid autonoom bestellingen kan omleiden bij vertraging."
                existingIntegration={integrations.find(i => i.provider === 'CJ_DROPSHIPPING')}
             />
             <div className="border-t border-white/10" />
             <SettingsIntegrationsClient 
                provider="IMAP_SUPPORT" 
                title="Gmail / IMAP Support" 
                description="Wachtwoord om E-mails te laten afhandelen."
                existingIntegration={integrations.find(i => i.provider === 'IMAP_SUPPORT')}
             />
             <div className="border-t border-white/10" />
             <SettingsIntegrationsClient 
                provider="STRIPE_API" 
                title="Stripe Global Payments" 
                description="Token voor wereldwijde afrekentransacties (Creditcard/Apple Pay)."
                existingIntegration={integrations.find(i => i.provider === 'STRIPE_API')}
             />
          </div>
        </div>

        <div className="bg-black/50 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">E-Commerce Platforms</h3>
            <p className="text-sm text-gray-400">Verbind je webshops voor automatische product push.</p>
          </div>
          <div className="space-y-6">
             <SettingsShopifyIntegrationsClient existingStores={shopifyStores} />
          </div>
        </div>
      </div>
    </div>
  );
}
