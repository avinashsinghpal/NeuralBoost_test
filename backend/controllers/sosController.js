// In-memory protective state for demo purposes
const sosState = {
  lastIncidents: [],
  temporaryBlacklist: {
    senders: new Set(),
    domains: new Set(),
    urls: new Set()
  },
  totalTriggers: 0
};

function normalizeDomain(value) {
  try {
    const u = new URL(value.startsWith('http') ? value : `http://${value}`);
    return u.hostname.toLowerCase();
  } catch (_e) {
    return String(value || '').trim().toLowerCase();
  }
}

function addToSet(set, value) {
  if (!value) return;
  set.add(String(value).trim());
}

function triggerSOS(req, res) {
  const now = Date.now();
  const {
    user = 'anonymous',
    contact = {},
    incident = {},
  } = req.body || {};

  // Extract potentially malicious indicators
  const suspectedSender = incident.sender || incident.from || '';
  const suspectedDomain = incident.domain || (suspectedSender.split('@')[1] || '');
  const suspectedUrl = incident.url || incident.link || '';

  // Defensive actions (simulated):
  addToSet(sosState.temporaryBlacklist.senders, suspectedSender);
  addToSet(sosState.temporaryBlacklist.domains, normalizeDomain(suspectedDomain));
  addToSet(sosState.temporaryBlacklist.urls, suspectedUrl);
  sosState.totalTriggers += 1;

  // Record incident snapshot (capped)
  sosState.lastIncidents.unshift({ user, contact, incident, ts: now });
  if (sosState.lastIncidents.length > 50) sosState.lastIncidents.length = 50;

  // Prepare helpline and portal guidance
  const helpline = {
    label: 'India Cybercrime Helpline (1930)',
    tel: 'tel:1930'
  };

  const portal = {
    label: 'National Cybercrime Reporting Portal',
    url: 'https://www.cybercrime.gov.in/'
  };

  // Prefill payload the UI can copy to clipboard for quick reporting
  const prefill = {
    name: contact.name || '',
    phone: contact.phone || '',
    email: contact.email || '',
    category: 'Cyber Fraud / Phishing',
    summary: incident.summary || incident.subject || 'Suspected phishing/scam incident requiring urgent action',
    details: incident.details || incident.body || '',
    sender: suspectedSender || '',
    domain: suspectedDomain || '',
    url: suspectedUrl || '',
    timestamp: new Date(now).toISOString()
  };

  return res.json({
    ok: true,
    message: `SOS triggered by ${user}`,
    ts: now,
    guidance: { helpline, portal, prefill },
    defensiveActions: {
      blacklisted: {
        senders: suspectedSender ? [suspectedSender] : [],
        domains: suspectedDomain ? [normalizeDomain(suspectedDomain)] : [],
        urls: suspectedUrl ? [suspectedUrl] : []
      },
      totals: {
        sosTriggers: sosState.totalTriggers,
        lastIncidents: sosState.lastIncidents.length
      }
    }
  });
}

function getSOSState(_req, res) {
  res.json({
    ok: true,
    totalTriggers: sosState.totalTriggers,
    lastIncidents: sosState.lastIncidents,
    blacklist: {
      senders: Array.from(sosState.temporaryBlacklist.senders),
      domains: Array.from(sosState.temporaryBlacklist.domains),
      urls: Array.from(sosState.temporaryBlacklist.urls)
    }
  });
}

module.exports = { triggerSOS, getSOSState };
