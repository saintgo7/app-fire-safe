import {
  sanitizeInput,
  validatePhoneNumber,
  formatPhoneNumber,
  validateAddress,
  validateDescription,
  validateSeverity,
  validateEmergencyReport,
  validateSafetyCheck,
  formatDate,
  getRelativeTime
} from './validation';

describe('Validation Utilities', () => {
  describe('sanitizeInput', () => {
    test('XSS 공격 방지', () => {
      const malicious = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(malicious);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;script&gt;');
    });

    test('일반 텍스트는 그대로 유지', () => {
      const normal = '안전한 텍스트입니다';
      const sanitized = sanitizeInput(normal);

      expect(sanitized).toBe(normal);
    });

    test('문자열이 아닌 입력은 그대로 반환', () => {
      const number = 12345;
      const sanitized = sanitizeInput(number);

      expect(sanitized).toBe(number);
    });
  });

  describe('validatePhoneNumber', () => {
    test('올바른 휴대폰 번호 (010)', () => {
      expect(validatePhoneNumber('010-1234-5678')).toBe(true);
      expect(validatePhoneNumber('01012345678')).toBe(true);
      expect(validatePhoneNumber('010 1234 5678')).toBe(true);
    });

    test('올바른 서울 지역번호 (02)', () => {
      expect(validatePhoneNumber('02-1234-5678')).toBe(true);
      expect(validatePhoneNumber('02-123-4567')).toBe(true);
    });

    test('올바른 지역번호 (031, 032 등)', () => {
      expect(validatePhoneNumber('031-123-4567')).toBe(true);
      expect(validatePhoneNumber('032-1234-5678')).toBe(true);
    });

    test('잘못된 전화번호', () => {
      expect(validatePhoneNumber('1234')).toBe(false);
      expect(validatePhoneNumber('abc-defg-hijk')).toBe(false);
      expect(validatePhoneNumber('010-123-456')).toBe(false);
    });
  });

  describe('formatPhoneNumber', () => {
    test('휴대폰 번호 포맷팅', () => {
      expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678');
    });

    test('서울 지역번호 포맷팅 (9자리)', () => {
      expect(formatPhoneNumber('021234567')).toBe('02-123-4567');
    });

    test('서울 지역번호 포맷팅 (10자리)', () => {
      expect(formatPhoneNumber('0212345678')).toBe('02-1234-5678');
    });

    test('지역번호 포맷팅 (10자리)', () => {
      expect(formatPhoneNumber('0311234567')).toBe('031-123-4567');
    });

    test('지역번호 포맷팅 (11자리)', () => {
      expect(formatPhoneNumber('03112345678')).toBe('031-1234-5678');
    });

    test('이미 포맷팅된 번호', () => {
      const formatted = '010-1234-5678';
      expect(formatPhoneNumber(formatted)).toBe(formatted);
    });
  });

  describe('validateAddress', () => {
    test('올바른 주소', () => {
      expect(validateAddress('서울시 강남구 테헤란로 123')).toBe(true);
      expect(validateAddress('부산광역시 해운대구')).toBe(true);
    });

    test('너무 짧은 주소', () => {
      expect(validateAddress('서울')).toBe(false);
      expect(validateAddress('123')).toBe(false);
    });

    test('너무 긴 주소', () => {
      const longAddress = 'a'.repeat(201);
      expect(validateAddress(longAddress)).toBe(false);
    });

    test('빈 문자열', () => {
      expect(validateAddress('')).toBe(false);
      expect(validateAddress('   ')).toBe(false);
    });

    test('null 또는 undefined', () => {
      expect(validateAddress(null)).toBe(false);
      expect(validateAddress(undefined)).toBe(false);
    });
  });

  describe('validateDescription', () => {
    test('올바른 설명', () => {
      expect(validateDescription('화재가 발생했습니다. 즉시 대피하세요.')).toBe(true);
    });

    test('너무 짧은 설명', () => {
      expect(validateDescription('화재')).toBe(false);
      expect(validateDescription('123456789')).toBe(false); // 9자
    });

    test('너무 긴 설명', () => {
      const longDesc = 'a'.repeat(1001);
      expect(validateDescription(longDesc)).toBe(false);
    });

    test('빈 문자열', () => {
      expect(validateDescription('')).toBe(false);
      expect(validateDescription('   ')).toBe(false);
    });
  });

  describe('validateSeverity', () => {
    test('올바른 위험도', () => {
      expect(validateSeverity('low')).toBe(true);
      expect(validateSeverity('medium')).toBe(true);
      expect(validateSeverity('high')).toBe(true);
      expect(validateSeverity('critical')).toBe(true);
    });

    test('잘못된 위험도', () => {
      expect(validateSeverity('unknown')).toBe(false);
      expect(validateSeverity('extreme')).toBe(false);
      expect(validateSeverity('')).toBe(false);
    });
  });

  describe('validateEmergencyReport', () => {
    test('올바른 긴급 신고 데이터', () => {
      const formData = {
        location: '서울시 강남구 테헤란로 123',
        description: '2층에서 화재가 발생했습니다. 연기가 많이 나고 있습니다.',
        severity: 'high',
        contact: '010-1234-5678'
      };

      const result = validateEmergencyReport(formData);

      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    test('잘못된 위치', () => {
      const formData = {
        location: '서울', // 너무 짧음
        description: '화재가 발생했습니다. 즉시 대피하세요.',
        severity: 'high',
        contact: '010-1234-5678'
      };

      const result = validateEmergencyReport(formData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('location');
    });

    test('잘못된 설명', () => {
      const formData = {
        location: '서울시 강남구 테헤란로 123',
        description: '화재', // 너무 짧음
        severity: 'high',
        contact: '010-1234-5678'
      };

      const result = validateEmergencyReport(formData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('description');
    });

    test('잘못된 전화번호', () => {
      const formData = {
        location: '서울시 강남구 테헤란로 123',
        description: '화재가 발생했습니다. 즉시 대피하세요.',
        severity: 'high',
        contact: '123' // 잘못된 형식
      };

      const result = validateEmergencyReport(formData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('contact');
    });

    test('여러 필드 오류', () => {
      const formData = {
        location: '서울',
        description: '화재',
        severity: 'invalid',
        contact: '123'
      };

      const result = validateEmergencyReport(formData);

      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(1);
    });
  });

  describe('validateSafetyCheck', () => {
    test('올바른 안전 점검 데이터', () => {
      const checkData = {
        checklist: [
          { id: 1, item: '소화기 점검', checked: true },
          { id: 2, item: '화재 경보기', checked: false }
        ],
        notes: '특이사항 없음',
        completionRate: 50
      };

      const result = validateSafetyCheck(checkData);

      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    test('잘못된 체크리스트 (배열 아님)', () => {
      const checkData = {
        checklist: 'not an array',
        notes: '',
        completionRate: 0
      };

      const result = validateSafetyCheck(checkData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('checklist');
    });

    test('너무 긴 메모', () => {
      const longNotes = 'a'.repeat(2001);
      const checkData = {
        checklist: [],
        notes: longNotes,
        completionRate: 0
      };

      const result = validateSafetyCheck(checkData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('notes');
    });
  });

  describe('formatDate', () => {
    test('올바른 날짜 포맷팅', () => {
      const date = new Date('2024-01-15T10:30:00');
      const formatted = formatDate(date.toISOString());

      expect(formatted).toContain('2024-01-15');
      expect(formatted).toContain('10:30');
    });

    test('잘못된 날짜', () => {
      const formatted = formatDate('invalid-date');

      expect(formatted).toBe('잘못된 날짜');
    });
  });

  describe('getRelativeTime', () => {
    test('방금 전', () => {
      const now = new Date();
      const result = getRelativeTime(now.toISOString());

      expect(result).toBe('방금 전');
    });

    test('분 전', () => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - 5);
      const result = getRelativeTime(date.toISOString());

      expect(result).toContain('분 전');
    });

    test('시간 전', () => {
      const date = new Date();
      date.setHours(date.getHours() - 3);
      const result = getRelativeTime(date.toISOString());

      expect(result).toContain('시간 전');
    });

    test('일 전', () => {
      const date = new Date();
      date.setDate(date.getDate() - 5);
      const result = getRelativeTime(date.toISOString());

      expect(result).toContain('일 전');
    });

    test('한 달 이상 전 (전체 날짜 표시)', () => {
      const date = new Date();
      date.setDate(date.getDate() - 35);
      const result = getRelativeTime(date.toISOString());

      expect(result).toContain('-');
      expect(result).not.toContain('일 전');
    });
  });
});
