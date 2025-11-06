const senderAnalyzer = require('./senderAnalysis/senderAnalyzer');
const spoofDetection = require('./senderAnalysis/spoofDetection');
const urlChecker = require('./urlReputation/urlChecker');
const domainLookup = require('./urlReputation/domainLookup');
const punycodeDetector = require('./punycodeAnalysis/punycodeDetector');
const phishingIntent = require('./nlpContent/phishingIntent');
const attachmentScanner = require('./attachmentAnalysis/attachmentScanner');
// channel context removed per latest requirements

async function runAll(input, step) {
  const { headers, bodyText, urls, attachmentsMeta, channel } = input;

  const sender = await step('Analyzing Metadata', async () => {
    const s = senderAnalyzer.analyze(headers);
    const spoof = spoofDetection.detect(headers);
    return { score: Math.max(s.score, spoof.score), flags: [...s.flags, ...spoof.flags], evidence: { ...s.evidence, ...spoof.evidence } };
  });

  const url = await step('Checking URL Reputation', async () => {
    const rep = urlChecker.check(urls || []);
    const dom = domainLookup.lookup(urls || []);
    return { score: Math.max(rep.score, dom.score), flags: [...rep.flags, ...dom.flags], evidence: { ...rep.evidence, ...dom.evidence } };
  });

  const punycode = await step('Detecting Punycode/Homograph', async () => punycodeDetector.detect(urls || []));

  const nlp = await step('Analyzing Content Intent (NLP)', async () => phishingIntent.analyze(bodyText || ''));

  const attachment = await step('Scanning Attachments', async () => attachmentScanner.scan(attachmentsMeta || []));

  return { sender, url, punycode, nlp, attachment };
}

module.exports = { runAll };
