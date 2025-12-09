'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Settings {
  boardTheme: string;
  pieceTheme: string;
  showCoordinates: boolean;
  showNotation: boolean;
  playSounds: boolean;
  chessComUsername?: string;
  verificationCode?: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  boardTheme: 'brown',
  pieceTheme: 'neo',
  showCoordinates: true,
  showNotation: true,
  playSounds: true,
  chessComUsername: '',
  verificationCode: '',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chess-settings');
      if (saved) {
        try {
          setSettings({ ...defaultSettings, ...JSON.parse(saved) });
        } catch (e) {
          console.error('Failed to parse settings', e);
        }
      }

      // Fetch profile from backend
      import('@/app/actions/user').then(({ getUserProfile }) => {
        getUserProfile().then((profile) => {
          if (profile) {
            setSettings((prev) => ({
              ...prev,
              chessComUsername: profile.chessComUsername || '',
              verificationCode: profile.verificationCode
            }));
          }
        });
      });
    }
  }, []);



  const updateSettings = async (newSettings: Partial<Settings>) => {
    const previousSettings = { ...settings };
    const updated = { ...settings, ...newSettings };

    setSettings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chess-settings', JSON.stringify(updated));
    }

    // Sync chess.com username with backend
    if (newSettings.chessComUsername !== undefined) {
      try {
        const { updateProfile } = await import('@/app/actions/user');
        const result = await updateProfile({ chessComUsername: newSettings.chessComUsername });

        if (!result.success) {
          // Revert changes
          setSettings(previousSettings);
          if (typeof window !== 'undefined') {
            localStorage.setItem('chess-settings', JSON.stringify(previousSettings));
          }
          toast.error(result.error || 'Failed to update profile');
        } else {
          toast.success('Profile updated successfully');
        }
      } catch (error) {
        console.error('Failed to sync profile:', error);
        // Revert changes
        setSettings(previousSettings);
        if (typeof window !== 'undefined') {
          localStorage.setItem('chess-settings', JSON.stringify(previousSettings));
        }
        toast.error('Failed to update profile');
      }
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
