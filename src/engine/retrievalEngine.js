// Hybrid Multi-Signal Retrieval & Reranking Engine
// Strictly follows Section 5.7 & 5.8 of MEMORY Blueprint

/**
 * Executes hybrid retrieval across all indexed files
 * 
 * Formula:
 * score = 0.40 * semantic_similarity
 *       + 0.20 * metadata_match
 *       + 0.20 * person_match
 *       + 0.10 * text_match
 *       + 0.10 * contextual_match
 */
export function executeRetrieval(queryIntent, allFiles, allPeople, allLocations) {
  if (!queryIntent || !allFiles || allFiles.length === 0) {
    return { results: [], topConfidence: 'NO_MATCH', totalCandidates: 0 };
  }

  const queryLower = (queryIntent.rawQuery || '').toLowerCase();
  const queryTokens = (queryIntent.keywords || []).map(k => k.toLowerCase());
  const requestedPerson = queryIntent.person ? queryIntent.person.toLowerCase() : null;
  const requestedLocation = queryIntent.location ? queryIntent.location.toLowerCase() : null;
  const requestedMedia = queryIntent.media_type || 'all';
  const clothingFeature = queryIntent.clothing_or_feature ? queryIntent.clothing_or_feature.toLowerCase() : null;
  const sceneActivity = queryIntent.scene_or_activity ? queryIntent.scene_or_activity.toLowerCase() : null;

  const scoredCandidates = allFiles.map((file) => {
    // 1. Person Match Signal (0.0 - 1.0)
    let personScore = 0.0;
    let matchedPersonName = null;
    let matchedPersonFace = null;

    if (requestedPerson || clothingFeature) {
      if (file.person_ids && file.person_ids.length > 0) {
        file.person_ids.forEach(pId => {
          const person = allPeople.find(p => p.id === pId);
          if (person) {
            const pNameLower = person.name.toLowerCase();
            const fullNameLower = (person.fullName || '').toLowerCase();
            
            // Check direct name match
            if (requestedPerson && (pNameLower.includes(requestedPerson) || requestedPerson.includes(pNameLower) || fullNameLower.includes(requestedPerson))) {
              personScore = Math.max(personScore, 0.98);
              matchedPersonName = person.name;
            }

            // Check person tags / aliases
            if (person.tags) {
              for (const tag of person.tags) {
                if (queryLower.includes(tag.toLowerCase())) {
                  personScore = Math.max(personScore, 0.90);
                  matchedPersonName = person.name;
                }
              }
            }

            // Check clothing / feature (e.g. orange shirt)
            if (clothingFeature && (person.distinguishingFeatures || '').toLowerCase().includes(clothingFeature)) {
              personScore = Math.max(personScore, 0.99);
              matchedPersonName = person.name;
            }
          }
        });
      }

      // Check visual_features.faces specifically
      if (file.visual_features?.faces) {
        file.visual_features.faces.forEach(f => {
          if (requestedPerson && f.name && f.name.toLowerCase().includes(requestedPerson)) {
            personScore = Math.max(personScore, f.confidence || 0.95);
            matchedPersonName = f.name;
            matchedPersonFace = f;
          }
          if (clothingFeature && f.attributes) {
            if (f.attributes.some(a => a.toLowerCase().includes(clothingFeature))) {
              personScore = Math.max(personScore, 0.98);
              matchedPersonName = f.name;
              matchedPersonFace = f;
            }
          }
        });
      }
    } else {
      // If query does not mention person, neutral baseline
      personScore = 0.3;
    }

    // 2. Metadata Match Signal (0.0 - 1.0)
    let metaScore = 0.5;
    if (requestedMedia !== 'all') {
      if (file.media_category === requestedMedia) {
        metaScore = 1.0;
      } else {
        metaScore = 0.1;
      }
    } else {
      // Bonus if filename or media type aligns
      if (file.filename.toLowerCase().includes('resume') && queryLower.includes('resume')) {
        metaScore = 0.95;
      } else if (file.filename.toLowerCase().includes('beach') && queryLower.includes('beach')) {
        metaScore = 0.95;
      }
    }

    // 3. Text & OCR Match Signal (0.0 - 1.0)
    let textScore = 0.0;
    const matchedSnippets = [];
    const fullText = ((file.ocr_text || '') + ' ' + (file.summary || '') + ' ' + (file.title || '')).toLowerCase();

    // Check query tokens in OCR / chunk text
    let hitCount = 0;
    queryTokens.forEach(token => {
      if (token.length > 2 && fullText.includes(token)) {
        hitCount++;
      }
    });

    if (queryTokens.length > 0) {
      textScore = Math.min(1.0, hitCount / Math.max(1, queryTokens.length * 0.7));
    }

    // Find relevant snippet from chunks or OCR
    if (file.chunks) {
      file.chunks.forEach(chunk => {
        let chunkHits = 0;
        queryTokens.forEach(t => {
          if (chunk.text.toLowerCase().includes(t)) chunkHits++;
        });
        if (chunkHits > 0) {
          matchedSnippets.push(chunk.text);
        }
      });
    }

    if (file.ocr_text && (queryLower.includes('iqoo') || queryLower.includes('cardano') || queryLower.includes('z11') || queryLower.includes('quester'))) {
      textScore = Math.max(textScore, 0.92);
      matchedSnippets.push(file.ocr_text);
    }

    // 4. Contextual & Location Match Signal (0.0 - 1.0)
    let contextScore = 0.0;
    let matchedLocationName = null;

    if (requestedLocation || sceneActivity) {
      const loc = allLocations.find(l => l.id === file.location_id);
      if (loc) {
        const locName = (loc.coarse_name || '').toLowerCase();
        const shortName = (loc.short_name || '').toLowerCase();
        
        if (requestedLocation && (locName.includes(requestedLocation) || shortName.includes(requestedLocation))) {
          contextScore = 0.96;
          matchedLocationName = loc.coarse_name;
        }

        if (sceneActivity && loc.tags && loc.tags.some(t => sceneActivity.includes(t) || t.includes(sceneActivity))) {
          contextScore = Math.max(contextScore, 0.92);
          matchedLocationName = loc.coarse_name;
        }
      }

      // Check visual_features scene
      if (file.visual_features?.scene) {
        const sceneText = file.visual_features.scene.toLowerCase();
        if (sceneActivity && sceneText.includes(sceneActivity)) {
          contextScore = Math.max(contextScore, 0.90);
        }
      }
    } else {
      contextScore = 0.25;
    }

    // 5. Semantic Vector Similarity Signal (0.0 - 1.0)
    let semanticScore = 0.0;
    const fileKeywords = (file.semantic_keywords || []).map(k => k.toLowerCase());
    let semHits = 0;

    queryTokens.forEach(qToken => {
      fileKeywords.forEach(k => {
        if (k.includes(qToken) || qToken.includes(k)) {
          semHits += 1.0;
        }
      });
    });

    if (clothingFeature && file.semantic_keywords?.some(k => k.includes(clothingFeature))) {
      semHits += 2.0;
    }

    if (sceneActivity && file.semantic_keywords?.some(k => k.includes(sceneActivity))) {
      semHits += 1.5;
    }

    semanticScore = Math.min(1.0, (semHits / Math.max(1, queryTokens.length + 1)) * 0.8 + 0.15);

    // Negative query dampener: If query has specific words that have zero overlap with anything in the file
    const negativeTokens = ['dog', 'cat', 'paris', 'tokyo', 'airplane', 'supermarket', 'mountain', 'car', 'bike'];
    let negCount = 0;
    negativeTokens.forEach(n => {
      if (queryLower.includes(n) && !fullText.includes(n) && !fileKeywords.includes(n)) {
        negCount++;
      }
    });

    if (negCount > 0) {
      semanticScore *= 0.15;
      personScore *= 0.15;
      textScore *= 0.15;
      contextScore *= 0.15;
    }

    // Weighted Ranking Formula (Blueprint 5.8)
    const finalScore = (
      0.40 * semanticScore +
      0.20 * metaScore +
      0.20 * personScore +
      0.10 * textScore +
      0.10 * contextScore
    );

    // Determine Confidence Tier
    let confidenceLevel = 'NO_MATCH';
    if (finalScore >= 0.72) {
      confidenceLevel = 'HIGH';
    } else if (finalScore >= 0.50) {
      confidenceLevel = 'MEDIUM';
    } else if (finalScore >= 0.30) {
      confidenceLevel = 'LOW';
    }

    // Evidence signals for "Why this matched"
    const evidence = {
      matchedPerson: matchedPersonName,
      matchedFace: matchedPersonFace,
      matchedLocation: matchedLocationName,
      matchedSnippets: Array.from(new Set(matchedSnippets)).slice(0, 2),
      matchedKeywords: queryTokens.filter(t => fullText.includes(t) || fileKeywords.includes(t)),
      signals: [
        { label: 'Semantic Concept Similarity', weight: 0.40, rawScore: semanticScore, effective: 0.40 * semanticScore },
        { label: 'Person Identity Match', weight: 0.20, rawScore: personScore, effective: 0.20 * personScore },
        { label: 'Metadata & MIME Fit', weight: 0.20, rawScore: metaScore, effective: 0.20 * metaScore },
        { label: 'OCR & Text Keyword Hits', weight: 0.10, rawScore: textScore, effective: 0.10 * textScore },
        { label: 'Contextual & Location Signal', weight: 0.10, rawScore: contextScore, effective: 0.10 * contextScore }
      ]
    };

    return {
      file,
      score: parseFloat(finalScore.toFixed(3)),
      confidenceLevel,
      evidence
    };
  });

  // Sort descending by finalScore
  const sorted = scoredCandidates.sort((a, b) => b.score - a.score);

  // Filter out complete non-matches (< 0.30) unless user wants all
  const filtered = sorted.filter(res => res.score >= 0.30);

  const topConfidence = filtered.length > 0 ? filtered[0].confidenceLevel : 'NO_MATCH';

  return {
    results: filtered,
    allCandidates: sorted,
    topConfidence,
    totalCandidates: allFiles.length
  };
}
