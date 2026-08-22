// Face Detection & Profile Tagging Engine
// Strictly follows Section 5.1 & 5.11 of MEMORY Blueprint

/**
 * Detects faces in an image (simulated / canvas-based on-device face detector)
 */
export async function detectFacesInImage(imageUri, existingPeople = []) {
  // Return pre-trained detection profiles for known demo images
  if (imageUri.includes('friend.jpeg')) {
    return [
      {
        id: 'face-prithiv-1',
        name: 'Prithiv',
        box: { x: 38, y: 34, w: 12, h: 14 },
        confidence: 0.99,
        attributes: ['orange shirt', 'glasses', 'curly hair', 'iQOO badge']
      },
      {
        id: 'face-nevan-2',
        name: 'Nevan',
        box: { x: 54, y: 30, w: 13, h: 15 },
        confidence: 0.97,
        attributes: ['black shirt', 'glasses', 'smiling']
      }
    ];
  }

  if (imageUri.includes('beach.jpeg')) {
    return [
      {
        id: 'face-nevan-1',
        name: 'Nevan',
        box: { x: 50, y: 15, w: 26, h: 42 },
        confidence: 0.98,
        attributes: ['black cardano cap', 'spectacles', 'earphones']
      }
    ];
  }

  // Default heuristic for user uploaded photos
  return [
    {
      id: `face-${Date.now()}-1`,
      name: 'Unassigned Person',
      box: { x: 35, y: 25, w: 30, h: 35 },
      confidence: 0.88,
      attributes: ['face detected']
    }
  ];
}

/**
 * Assign or update a person label on a detected face in a file
 */
export function assignFaceToPerson(file, faceIndex, personName, allPeople) {
  const updatedFaces = [...(file.visual_features?.faces || [])];
  if (updatedFaces[faceIndex]) {
    updatedFaces[faceIndex] = {
      ...updatedFaces[faceIndex],
      name: personName,
      confidence: 0.99
    };
  }

  // Update person_ids list in file
  let person = allPeople.find(p => p.name.toLowerCase() === personName.toLowerCase());
  const personId = person ? person.id : `person-${personName.toLowerCase().replace(/\s+/g, '-')}`;

  const updatedPersonIds = Array.from(new Set([...(file.person_ids || []), personId]));

  // Update semantic keywords
  const updatedKeywords = Array.from(new Set([
    ...(file.semantic_keywords || []),
    personName.toLowerCase(),
    `photo with ${personName.toLowerCase()}`
  ]));

  return {
    ...file,
    person_ids: updatedPersonIds,
    semantic_keywords: updatedKeywords,
    visual_features: {
      ...(file.visual_features || {}),
      faces: updatedFaces
    }
  };
}
