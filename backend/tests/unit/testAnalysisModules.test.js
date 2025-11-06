const senderAnalyzer = require('../../modules/senderAnalysis/senderAnalyzer');
const urlChecker = require('../../modules/urlReputation/urlChecker');
const punycodeDetector = require('../../modules/punycodeAnalysis/punycodeDetector');
const phishingIntent = require('../../modules/nlpContent/phishingIntent');
const attachmentScanner = require('../../modules/attachmentAnalysis/attachmentScanner');

describe('Modules basic shape', () => {
  test('senderAnalyzer returns shape', () => {
    const r = senderAnalyzer.analyze({ From: 'Alice <alice@gmail.com>' });
    expect(r).toHaveProperty('score');
    expect(r).toHaveProperty('flags');
    expect(Array.isArray(r.flags)).toBe(true);
  });

  test('urlChecker flags blacklist', () => {
    const r = urlChecker.check(['http://bad-actor.com/x']);
    expect(r.flags).toContain('blacklisted_domain');
  });

  test('punycodeDetector detects xn--', () => {
    const r = punycodeDetector.detect(['http://xn--pple-43d.com']);
    expect(r.flags).toContain('punycode');
  });

  test('phishingIntent detects urgency', () => {
    const r = phishingIntent.analyze('URGENT: verify your account now');
    expect(r.score).toBeGreaterThan(0);
  });

  test('attachmentScanner detects risky ext', () => {
    const r = attachmentScanner.scan([{ filename: 'invoice.docm', size: 1024 }]);
    expect(r.flags).toContain('risky_extension');
  });
});


