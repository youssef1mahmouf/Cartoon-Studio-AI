import Sidebar from '@/components/ui/layout/Sidebar';
import Topbar from '@/components/ui/layout/Topbar';
import { useStore } from '@/stores/useStore';
import { useEffect } from 'react';
import { Button } from '@/components/ui/forms';
import { api } from '@/services/api';

export default function Settings() {
  const { settings, setSettings } = useStore();

  // Fetch settings from API on mount
  useEffect(() => {
    api.settings.get().then((res) => {
      setSettings(res.data);
    });
  }, [setSettings]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          {/* API Keys Section */}
          <div className="grid md:grid-cols-2 mb-8">
            {/* OpenRouter Key */}
            <div className="bg-card rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-medium mb-2">OpenRouter API Key</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="sk-or-..."
                  readOnly
                  className="w-full px-3 py-2 rounded-lg bg-input text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  onClick={() => {}}
                  className="absolute right-3 text-sm text-primary"
                >
                  Refresh
                </Button>
              </div>
              <p className="text-xs text-muted-500">
                Get key from https://openrouter.ai/keys
              </p>
            </div>

            {/* HuggingFace Key */}
            <div className="bg-card rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-medium mb-2">HuggingFace Token</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="hf_..."
                  readOnly
                  className="w-full px-3 py-2 rounded-lg bg-input text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  onClick={() => {}}
                  className="absolute right-3 text-sm text-primary"
                >
                  Refresh
                </Button>
              </div>
              <p className="text-xs text-muted-500">
                Get token from https://huggingface.co/settings/tokens
              </p>
            </div>
          </div>

          {/* Provider Configuration */}
          <div className="bg-card rounded-xl p-6">
            <h3 className="text-sm font-medium mb-4">Provider Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Default Provider
                </label>
                <select
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      selected_provider: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-input text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="kokoro">Kokoro (TTS)</option>
                  <option value="piper">Piper (TTS)</option>
                </select>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}