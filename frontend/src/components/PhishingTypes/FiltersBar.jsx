import React from 'react';
import { Search, X } from 'lucide-react';
import { CHANNEL_COLORS, SEVERITY_LEVELS } from '../../data/phishingTypes';

const CHANNELS = ['All', 'email', 'sms', 'voice', 'social', 'web'];
const SEVERITIES = ['All', 'low', 'medium', 'high'];

export default function FiltersBar({
  searchQuery,
  onSearchChange,
  selectedChannel,
  onChannelChange,
  selectedSeverity,
  onSeverityChange,
  resultCount,
  onReset
}) {
  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or definition..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          aria-label="Search phishing types"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Channel Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Channel:
          </span>
          <div className="flex flex-wrap gap-2">
            {CHANNELS.map((channel) => (
              <button
                key={channel}
                onClick={() => onChannelChange(channel === 'All' ? 'all' : channel)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  (channel === 'All' && selectedChannel === 'all') ||
                  (channel !== 'All' && selectedChannel === channel)
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                style={
                  (channel === 'All' && selectedChannel === 'all') ||
                  (channel !== 'All' && selectedChannel === channel)
                    ? channel === 'All'
                      ? { backgroundColor: '#6b7280' }
                      : { backgroundColor: CHANNEL_COLORS[channel] }
                    : {}
                }
                aria-pressed={
                  (channel === 'All' && selectedChannel === 'all') ||
                  (channel !== 'All' && selectedChannel === channel)
                }
              >
                {channel}
              </button>
            ))}
          </div>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Severity:
          </span>
          <div className="flex flex-wrap gap-2">
            {SEVERITIES.map((severity) => (
              <button
                key={severity}
                onClick={() => onSeverityChange(severity === 'All' ? 'all' : severity)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  (severity === 'All' && selectedSeverity === 'all') ||
                  (severity !== 'All' && selectedSeverity === severity)
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                style={
                  (severity === 'All' && selectedSeverity === 'all') ||
                  (severity !== 'All' && selectedSeverity === severity)
                    ? severity === 'All'
                      ? { backgroundColor: '#6b7280' }
                      : {
                          backgroundColor: SEVERITY_LEVELS[severity].color
                        }
                    : {}
                }
                aria-pressed={
                  (severity === 'All' && selectedSeverity === 'all') ||
                  (severity !== 'All' && selectedSeverity === severity)
                }
              >
                {severity}
              </button>
            ))}
          </div>
        </div>

        {/* Result Count */}
        <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
          {resultCount} {resultCount === 1 ? 'result' : 'results'}
        </div>
      </div>
    </div>
  );
}

