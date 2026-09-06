import { Language, INITIAL_ROOMS, INITIAL_CLASSES } from '../types/schedule';

// Bidirectional mappings between Class ID and primary Room ID
export const CLASS_TO_ROOM_MAP: Record<string, string> = {
  '6': '501',
  '7': '502',
  '8': '4010',
  '9': '4011',
  '10-tn': '4012',
  '10.1-tn': '4012',
  '10-nt': '307',
  '10.2-nt': '307',
  '11-tn': '504',
  '11.1-tn': '504',
  '11.2-xh': 'P. Tâm lý học đường',
  '11.2-tn': 'P. Tâm lý học đường',
  '12-tn': '503'
};

export const ROOM_TO_CLASS_MAP: Record<string, string> = {
  '501': '6',
  '502': '7',
  '4010': '8',
  '4011': '9',
  '4012': '10.1-tn',
  '307': '10.2-nt',
  '504': '11.1-tn',
  'p. tâm lý học đường': '11.2-xh',
  'tâm lý học đường': '11.2-xh',
  'tam-ly': '11.2-xh',
  'tl': '11.2-xh',
  '503': '12-tn'
};

export function isKnownRoom(roomId: string): boolean {
  const clean = roomId.trim().toLowerCase().replace(/^room\s*/i, '').replace(/^p\.?\s*/i, '');
  const raw = roomId.trim().toLowerCase();
  return Boolean(
    ROOM_TO_CLASS_MAP[clean] || 
    ROOM_TO_CLASS_MAP[raw] || 
    INITIAL_ROOMS.some(r => {
      const rClean = r.id.toLowerCase().replace(/^room\s*/i, '').replace(/^p\.?\s*/i, '');
      return r.id.toLowerCase() === raw || rClean === clean || r.nameVi.toLowerCase() === raw || r.nameEn.toLowerCase() === raw;
    })
  );
}

export function isKnownClass(classId: string): boolean {
  const clean = classId.trim().toLowerCase();
  return Boolean(
    CLASS_TO_ROOM_MAP[clean] || 
    INITIAL_CLASSES.some(c => c.id.toLowerCase() === clean) ||
    clean.startsWith('10') ||
    clean.startsWith('11') ||
    clean.startsWith('12') ||
    clean === '6' || clean === '7' || clean === '8' || clean === '9'
  );
}

export interface ParsedRoute {
  lang: Language;
  viewType: 'room' | 'class';
  roomId: string;
  classId: string;
  isLive: boolean;
  isValid: boolean;
}

export function parsePath(pathname: string): ParsedRoute {
  const clean = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!clean) {
    return {
      lang: 'vi',
      viewType: 'class',
      roomId: '504',
      classId: '11-tn',
      isLive: false,
      isValid: true
    };
  }

  const segments = clean.split('/').filter(Boolean);
  let lang: Language = 'vi';
  let idx = 0;

  if (segments[idx] === 'vi' || segments[idx] === 'en') {
    lang = segments[idx] as Language;
    idx++;
  }

  const remaining = segments.slice(idx);

  // 1. Explicit Room Route: /room/:roomId or /room/:roomId/live
  if (remaining[0] === 'room' && remaining[1]) {
    const rawRoom = remaining[1].replace(/^p\.?\s*/i, '');
    const valid = isKnownRoom(rawRoom);
    return {
      lang,
      viewType: 'room',
      roomId: rawRoom,
      classId: ROOM_TO_CLASS_MAP[rawRoom] || '11-tn',
      isLive: true,
      isValid: valid
    };
  }

  // 2. Explicit Class Route: /class/:classId
  if (remaining[0] === 'class' && remaining[1]) {
    const cId = remaining[1];
    const valid = isKnownClass(cId);
    return {
      lang,
      viewType: 'class',
      roomId: CLASS_TO_ROOM_MAP[cId] || '504',
      classId: cId,
      isLive: false,
      isValid: valid
    };
  }

  // 3. Single Segment after lang: e.g. /vi/11-tn or /vi/504
  if (remaining[0]) {
    const seg = remaining[0];
    if (isKnownClass(seg)) {
      return {
        lang,
        viewType: 'class',
        roomId: CLASS_TO_ROOM_MAP[seg] || '504',
        classId: seg,
        isLive: false,
        isValid: true
      };
    }
    if (isKnownRoom(seg)) {
      return {
        lang,
        viewType: 'room',
        roomId: seg,
        classId: ROOM_TO_CLASS_MAP[seg] || '11-tn',
        isLive: true,
        isValid: true
      };
    }
    // Unrecognized ID: treat as room number to check (will show 404 Room Not Found if invalid)
    return {
      lang,
      viewType: 'room',
      roomId: seg,
      classId: '11-tn',
      isLive: true,
      isValid: false
    };
  }

  return {
    lang,
    viewType: 'class',
    roomId: '504',
    classId: '11-tn',
    isLive: false,
    isValid: true
  };
}
