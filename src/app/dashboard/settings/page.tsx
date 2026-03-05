import { getProfile, getSubscription, getUsage } from "@/lib/db";
import SettingsClient from "@/app/dashboard/settings/SettingsClient";

export default async function SettingsPage() {
  const [profile, subscription, usage] = await Promise.all([
    getProfile(),
    getSubscription(),
    getUsage(),
  ]);

  return (
    <SettingsClient
      profile={profile}
      subscription={subscription}
      usage={usage}
    />
  );
}