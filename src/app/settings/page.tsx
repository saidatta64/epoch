'use client';

import { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { clsx } from 'clsx';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [username, setUsername] = useState(settings.chessComUsername || '');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsername(settings.chessComUsername || '');
  }, [settings.chessComUsername]);

  const themes = [
    { id: 'brown', name: 'Classic Brown', colors: 'bg-[#B58863]' },
    { id: 'green', name: 'Tournament Green', colors: 'bg-[#769656]' },
    { id: 'blue', name: 'Modern Blue', colors: 'bg-[#8CA2AD]' },
  ] as const;
  return (
    <div className="max-w-4xl space-y-8 text-gray-900">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Customize your chess experience.</p>
      </div>

      <div className="space-y-6 border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Board Appearance</h2>
          <p className="text-sm text-gray-500">Select your preferred board color theme.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => updateSettings({ boardTheme: theme.id })}
              className={clsx(
                'relative flex items-center gap-3 border p-4 text-left transition-all hover:bg-gray-50 cursor-pointer',
                settings.boardTheme === theme.id
                  ? 'border-blue-600 ring-1 ring-blue-600'
                  : 'border-gray-200'
              )}
            >
              <div className={clsx('h-8 w-8 border border-gray-300', theme.colors)} />
              <span className="font-medium text-gray-900">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>



      <div className="space-y-6 border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Move Notation</h2>
            <p className="text-sm text-gray-500">Show coordinates on the board.</p>
          </div>
          <button
            onClick={() => updateSettings({ showNotation: !settings.showNotation })}
            className={clsx(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
              settings.showNotation ? 'bg-blue-600' : 'bg-gray-200'
            )}
          >
            <span
              className={clsx(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                settings.showNotation ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>
      </div>
      <div className="space-y-6 border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Chess.com Integration</h2>
          <p className="text-sm text-gray-500">Link your Chess.com account to display on your profile.</p>
        </div>

        <div>
          <label htmlFor="chessComUsername" className="block text-sm font-medium text-gray-700">
            Chess.com Username
          </label>

          <div className="mt-4 rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Verification Required</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>To verify your account, please add the following code to your Chess.com <strong>Location</strong> field:</p>
                  <div className="mt-2 font-mono font-bold bg-white p-2 rounded border border-blue-200 inline-block select-all">
                    {settings.verificationCode || 'Loading...'}
                  </div>
                  <p className="mt-2">After updating your profile, click the button below.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-lg mt-3">
            {/* <div className="p-4 bg-white shadow-md border border-gray-200 rounded-xl"> */}

            <div className="flex items-center gap-3">
              <div className="flex flex-1 items-center rounded-lg border border-gray-300 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <span className="px-3 text-gray-500 text-sm whitespace-nowrap"> </span>

                <input
                  type="text"
                  id="chessComUsername"
                  name="chessComUsername"
                  className="flex-1 bg-transparent py-2 px-1 text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <button
                onClick={() => updateSettings({ chessComUsername: username })}
                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-500 active:scale-95 transition-all whitespace-nowrap"
              >
                Check Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
