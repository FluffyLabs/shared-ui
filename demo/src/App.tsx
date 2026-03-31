import { useState } from "react";
import { Header } from "../../lib/components/Header";
import { AppsSidebar } from "../../lib/components/AppsSidebar";
import { Content } from "../../lib/components/Content";
import { initializeTheme } from "../../lib/components/DarkMode";
import { SupabaseProvider } from "../../lib/supabase/SupabaseProvider";
import { UserMenu } from "../../lib/supabase/UserMenu";
import { AuthFlow } from "../../lib/supabase/AuthFlow";
import { Settings } from "../../lib/supabase/Settings";
import { SubscriptionStatus } from "../../lib/supabase/SubscriptionStatus";
import { PricingCard } from "../../lib/supabase/PricingCard";
import { QuotaGate } from "../../lib/supabase/QuotaGate";
import { useUser } from "../../lib/supabase/useUser";
import { useQuota } from "../../lib/supabase/useQuota";
import { useSession } from "../../lib/supabase/useSession";
import { Alert } from "../../lib/ui/Alert/Alert";
import { Button } from "../../lib/ui/Button";
import ToolName from "../../lib/assets/tool-name.svg";

// Read Supabase config from env (injected at build time)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

initializeTheme();

type Page = "home" | "login" | "settings" | "pricing" | "gated";

export function App() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8">
        <Alert intent="warning" className="max-w-lg">
          <Alert.Title>Missing Supabase configuration</Alert.Title>
          <Alert.Text>
            Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> environment variables to connect
            this demo to a Supabase project.
          </Alert.Text>
        </Alert>
      </div>
    );
  }

  return (
    <SupabaseProvider supabaseUrl={SUPABASE_URL} supabaseAnonKey={SUPABASE_ANON_KEY} appId="demo">
      <DemoApp />
    </SupabaseProvider>
  );
}

function DemoApp() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        toolNameSrc={ToolName}
        endSlot={<UserMenu compact onLoginClick={() => setPage("login")} onSettingsClick={() => setPage("settings")} />}
      />
      <div className="flex flex-1">
        <AppsSidebar activeLink="debugger" />
        <Content>
          <div className="p-6">
            <PageContent page={page} setPage={setPage} />
          </div>
        </Content>
      </div>
    </div>
  );
}

function PageContent({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  switch (page) {
    case "login":
      return <LoginPage onSuccess={() => setPage("home")} />;
    case "settings":
      return <SettingsPage />;
    case "pricing":
      return <PricingPage />;
    case "gated":
      return <GatedFeaturePage />;
    default:
      return <HomePage setPage={setPage} />;
  }
}

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const { user, isLoading } = useUser();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">Shared UI Demo</h1>
      <p className="text-muted-foreground">
        This demo app tests the Supabase integration: authentication, subscription status, and quota-gated features.
      </p>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : user ? (
        <Alert intent="success">
          <Alert.Title>Logged in</Alert.Title>
          <Alert.Text>
            Welcome, <strong>{user.email}</strong>
          </Alert.Text>
        </Alert>
      ) : (
        <Alert intent="info">
          <Alert.Title>Not logged in</Alert.Title>
          <Alert.Text>Use the Login button in the header to sign in.</Alert.Text>
        </Alert>
      )}

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => setPage("pricing")}>
          View Pricing
        </Button>
        <Button variant="secondary" onClick={() => setPage("gated")}>
          Quota-Gated Feature
        </Button>
        <Button variant="secondary" onClick={() => setPage("settings")}>
          Settings
        </Button>
      </div>
    </div>
  );
}

function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  return (
    <div className="mx-auto max-w-sm pt-8">
      <AuthFlow onSuccess={onSuccess} />
    </div>
  );
}

function SettingsPage() {
  const handleCheckout = useCheckout();
  const handleManage = useManageSubscription();

  return (
    <div className="mx-auto max-w-md">
      <Settings />
      <div className="mx-auto max-w-md px-6">
        <SubscriptionStatus onCheckout={handleCheckout} onManage={handleManage} />
      </div>
    </div>
  );
}

function PricingPage() {
  const handleCheckout = useCheckout();

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 pt-8">
      <h2 className="text-xl font-semibold text-foreground">Upgrade to Pro</h2>
      <PricingCard onCheckout={handleCheckout} />
    </div>
  );
}

function GatedFeaturePage() {
  const handleCheckout = useCheckout();

  return (
    <div className="mx-auto max-w-lg pt-4">
      <h2 className="mb-4 text-xl font-semibold text-foreground">Quota-Gated Feature</h2>
      <QuotaGate action="demo-action" freeLimit={5} onCheckout={handleCheckout}>
        <DemoAction />
      </QuotaGate>
    </div>
  );
}

function DemoAction() {
  const { used, remaining, limit, increment } = useQuota("demo-action", { freeLimit: 5 });
  const [lastResult, setLastResult] = useState<string | null>(null);

  async function handleAction() {
    try {
      await increment();
      setLastResult(`Action performed! (${used + 1}${limit ? ` / ${limit}` : ""} used)`);
    } catch (err) {
      setLastResult(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-6">
      <p className="text-sm text-foreground">
        This simulates a premium action with rate limiting.
        {limit !== null && (
          <>
            {" "}
            You have <strong>{remaining}</strong> of <strong>{limit}</strong> free uses remaining this month.
          </>
        )}
        {limit === null && " You have unlimited uses (Pro plan)."}
      </p>
      <Button onClick={handleAction}>Perform Action</Button>
      {lastResult && <p className="text-sm text-muted-foreground">{lastResult}</p>}
    </div>
  );
}

// --- Helpers to call Edge Functions ---

function useCheckout() {
  const { session } = useSession();

  return async () => {
    if (!session?.access_token) {
      alert("Please log in first");
      return;
    }
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ returnUrl: window.location.href }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to create checkout session");
      }
    } catch {
      alert("Checkout is not configured. Deploy the create-checkout Edge Function first.");
    }
  };
}

function useManageSubscription() {
  const { session } = useSession();

  return async () => {
    if (!session?.access_token) {
      alert("Please log in first");
      return;
    }
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-portal`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ returnUrl: window.location.href }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to open subscription portal");
      }
    } catch {
      alert("Portal is not configured. Deploy the create-portal Edge Function first.");
    }
  };
}
