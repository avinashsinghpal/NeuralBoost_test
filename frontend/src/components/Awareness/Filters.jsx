import React from 'react';
import { Search, X } from 'lucide-react';
import { CHANNEL_COLORS, SEVERITY_LEVELS } from '../../data/phishingTypes';

export default function Filters({
  searchQuery,
  onSearchChange,
  selectedChannel,
  onChannelChange,
  selectedSeverities,
  onSeverityToggle,
}) {
  const channels = [
    { value: 'all', label: 'All Channels' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'voice', label: 'Voice' },
  ];

  const severities = ['low', 'medium', 'high'];

  return (
    <div className="space-y-4 mb-8">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search phishing types..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Search phishing types"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Channel Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Channel:
          </label>
          <select
            value={selectedChannel}
            onChange={(e) => onChannelChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Filter by channel"
          >
            {channels.map((channel) => (
              <option key={channel.value} value={channel.value}>
                {channel.label}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Chips */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Severity:
          </label>
          <div className="flex gap-2">
            {severities.map((severity) => {
              const isSelected = selectedSeverities.includes(severity);
              const severityData = SEVERITY_LEVELS[severity];
              return (
                <button
                  key={severity}
                  onClick={() => onSeverityToggle(severity)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isSelected
                      ? 'text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: severityData.color,
                        }
                      : {}
                  }
                  aria-pressed={isSelected}
                  aria-label={`Toggle ${severity} severity filter`}
                >
                  {severityData.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

