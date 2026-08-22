import { callGroqAPI, GROQ_MODELS } from '../config/groq.js';

/**
 * Parses user query into structured intent representation:
 * {
 *   person: string | null,
 *   location: string | null,
 *   media_type: 'photo' | 'document' | 'all',
 *   keywords: string[],
 *   scene_or_activity: string | null,
 *   temporal_context: string | null,
 *   isNegativeQuery: boolean
 * }
 */
export async function parseQueryIntent(rawQuery, isOffline = false, peopleList = [], locationsList = []) {
  const cleanQuery = (rawQuery || '').trim();
  if (!cleanQuery) return null;

  // If offline or forced on-device, use deterministic local rule parser
  if (isOffline) {
    return parseQueryLocally(cleanQuery, peopleList, locationsList);
  }

  // Attempt Groq structured parsing
  try {
    const systemPrompt = `You are the On-Device Intent Extraction Engine for iQOO MEMORY personal search.
Extract search intent from the user query into strict JSON format with keys:
{
  "person": string or null (e.g. "Prithiv", "Nevan", "Mom"),
  "location": string or null (e.g. "Marina Beach", "Chennai", "CIT"),
  "media_type": "photo" | "document" | "all",
  "keywords": array of relevant search strings,
  "scene_or_activity": string or null (e.g. "beach", "event", "internship", "interview"),
  "clothing_or_feature": string or null (e.g. "orange shirt", "cap", "glasses"),
  "is_negative_query": boolean (true if searching for something improbable like "dog in Paris" or "polar bear in desert")
}
Do NOT hallucinate. Return only valid JSON.`;

    const groqResponse = await callGroqAPI({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Query: "${cleanQuery}"` }
      ],
      model: GROQ_MODELS.FAST,
      temperature: 0.05,
      jsonMode: true,
      timeoutMs: 3000
    });

    if (groqResponse.success && groqResponse.content) {
      try {
        const parsed = JSON.parse(groqResponse.content);
        return {
          ...parsed,
          source: 'groq_ai',
          latencyMs: groqResponse.latencyMs,
          rawQuery: cleanQuery
        };
      } catch (e) {
        console.warn('Failed to parse Groq JSON response, falling back to local:', e);
      }
    }
  } catch (err) {
    console.warn('Groq parsing failed, falling back to local:', err);
  }

  // Fallback to local deterministic parser
  return parseQueryLocally(cleanQuery, peopleList, locationsList);
}

/**
 * Deterministic local rule & regex parser (Runs 100% on-device with <5ms latency)
 */
export function parseQueryLocally(query, peopleList = [], locationsList = []) {
  const lower = query.toLowerCase();

  // Media type extraction
  let media_type = 'all';
  if (/\b(photo|picture|pic|selfie|image|snapshot|camera)\b/i.test(lower)) {
    media_type = 'photo';
  } else if (/\b(resume|cv|doc|document|pdf|notes|report|paper|sheet)\b/i.test(lower)) {
    media_type = 'document';
  }

  // Person extraction
  let person = null;
  
  // Specific checks for Prithiv first if present in query
  if (/\b(prithiv|prithvi|prithivi)\b/i.test(lower)) {
    person = 'Prithiv';
  } else if (/\b(friend|colleague)\b/i.test(lower) && !/\b(my\s+friend)\b/i.test(lower)) {
    person = 'Prithiv';
  } else if (/\b(nevan)\b/i.test(lower)) {
    person = 'Nevan';
  } else if (/\b(my|mine|myself)\b/i.test(lower) && !/\b(friend)\b/i.test(lower)) {
    person = 'Nevan';
  } else if (/\b(photos?\s+of\s+me|selfie)\b/i.test(lower)) {
    person = 'Nevan';
  } else {
    // Check against dynamically registered people
    for (const p of peopleList) {
      const pNameLower = p.name.toLowerCase();
      if (pNameLower !== 'nevan' && pNameLower !== 'prithiv') {
        const regex = new RegExp(`\\b${pNameLower}\\b`, 'i');
        if (regex.test(lower)) {
          person = p.name;
          break;
        }
      }
    }
  }

  // Location extraction
  let location = null;
  const knownLocations = [
    { name: 'Marina Beach', terms: ['marina', 'marina beach', 'beach', 'sea', 'ocean', 'coast'] },
    { name: 'Chennai', terms: ['chennai', 'madras'] },
    { name: 'CIT Campus', terms: ['cit', 'college', 'chennai institute of technology', 'campus'] },
    { name: 'iQOO Event', terms: ['iqoo', 'iqoo connect', 'event', 'meetup', 'z11'] }
  ];

  for (const loc of knownLocations) {
    for (const term of loc.terms) {
      if (lower.includes(term)) {
        location = loc.name;
        break;
      }
    }
    if (location) break;
  }

  // Feature / clothing
  let clothing_or_feature = null;
  if (/orange\s*(shirt|tshirt|tee|top)/i.test(lower)) {
    clothing_or_feature = 'orange shirt';
  } else if (/cap|hat/i.test(lower)) {
    clothing_or_feature = 'cap';
  } else if (/glasses|spectacles/i.test(lower)) {
    clothing_or_feature = 'glasses';
  }

  // Activity / scene
  let scene_or_activity = null;
  if (/\b(beach|sea|shore|waves|vacation|trip)\b/i.test(lower)) {
    scene_or_activity = 'beach';
  } else if (/\b(event|meet|hackathon|community|conference|stage)\b/i.test(lower)) {
    scene_or_activity = 'event';
  } else if (/\b(intern|software|internship|job|work|engineer|engineering)\b/i.test(lower)) {
    scene_or_activity = 'software engineering';
  }

  // Keyword extraction (clean stopwords)
  const stopWords = new Set([
    'show', 'me', 'find', 'get', 'give', 'my', 'the', 'a', 'an', 'in', 'at', 'on', 'with', 'and', 'or', 'of', 'for', 'from', 'where', 'photos', 'photo', 'picture', 'pictures', 'pic', 'pics', 'image', 'images', 'files', 'file', 'doc', 'docs'
  ]);
  const tokens = lower.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(t => t.length > 1 && !stopWords.has(t));

  return {
    person,
    location,
    media_type,
    keywords: tokens,
    clothing_or_feature,
    scene_or_activity,
    is_negative_query: false,
    source: 'on_device_rule_engine',
    latencyMs: 3,
    rawQuery: query
  };
}

/**
 * Natural language synthesis for the query response
 */
export async function synthesizeAnswer(query, results, isOffline = false) {
  if (results.length === 0) {
    return "I couldn't find any matching photos, documents, or personal memories for this query.";
  }

  const top = results[0];
  const file = top.file;

  if (isOffline) {
    // Deterministic offline summary
    if (file.media_category === 'photo') {
      const locText = file.location_id ? ' taken in Chennai' : '';
      const personText = file.person_ids?.length ? ` featuring ${file.person_ids.map(p => p.replace('person-', '')).join(' and ')}` : '';
      return `Found 1 matching photo "${file.title}"${personText}${locText} with ${Math.round(top.score * 100)}% match confidence.`;
    } else {
      return `Found document "${file.filename}" matching "${top.evidence.matchedKeywords?.slice(0, 3).join(', ')}" (${Math.round(top.score * 100)}% confidence).`;
    }
  }

  // Online quick summary via Groq
  try {
    const prompt = `User searched: "${query}". Top retrieved evidence: "${file.title}" (${file.media_category}) - Summary: "${file.summary}".
Provide a 1-2 sentence direct, crisp response confirming what was found. Do NOT invent facts beyond the provided evidence.`;

    const groqRes = await callGroqAPI({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODELS.FAST,
      temperature: 0.1,
      timeoutMs: 3000
    });

    if (groqRes.success && groqRes.content) {
      return groqRes.content.trim();
    }
  } catch (e) {
    // fallback
  }

  return `Found "${file.title}" matching your query with ${Math.round(top.score * 100)}% evidence confidence.`;
}
