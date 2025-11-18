// 입력 검증 유틸리티

/**
 * 문자열을 안전하게 이스케이프 처리 (XSS 방지)
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * 한국 전화번호 형식 검증
 */
export const validatePhoneNumber = (phone) => {
  // 010-1234-5678, 02-1234-5678, 031-123-4567 등
  const phoneRegex = /^(01[0-9]|02|0[3-9][0-9])-?[0-9]{3,4}-?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * 전화번호 포맷팅
 */
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('02')) {
    // 서울 지역번호
    if (cleaned.length === 9) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    }
  } else if (cleaned.startsWith('01')) {
    // 휴대폰 번호
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else {
    // 기타 지역번호
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
  }

  return phone;
};

/**
 * 주소 검증
 */
export const validateAddress = (address) => {
  if (!address || typeof address !== 'string') return false;

  // 최소 5자 이상, 최대 200자 이하
  const trimmed = address.trim();
  return trimmed.length >= 5 && trimmed.length <= 200;
};

/**
 * 설명 텍스트 검증
 */
export const validateDescription = (description) => {
  if (!description || typeof description !== 'string') return false;

  // 최소 10자 이상, 최대 1000자 이하
  const trimmed = description.trim();
  return trimmed.length >= 10 && trimmed.length <= 1000;
};

/**
 * 위험도 검증
 */
export const validateSeverity = (severity) => {
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  return validSeverities.includes(severity);
};

/**
 * 긴급 신고 폼 전체 검증
 */
export const validateEmergencyReport = (formData) => {
  const errors = {};

  // 위치 검증
  if (!validateAddress(formData.location)) {
    errors.location = '발생 위치는 5자 이상 200자 이하로 입력해주세요.';
  }

  // 상황 설명 검증
  if (!validateDescription(formData.description)) {
    errors.description = '상황 설명은 10자 이상 1000자 이하로 입력해주세요.';
  }

  // 위험도 검증
  if (!validateSeverity(formData.severity)) {
    errors.severity = '올바른 위험도를 선택해주세요.';
  }

  // 연락처 검증
  if (!validatePhoneNumber(formData.contact)) {
    errors.contact = '올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * 안전 점검 데이터 검증
 */
export const validateSafetyCheck = (checkData) => {
  const errors = {};

  // 체크리스트 검증
  if (!checkData.checklist || !Array.isArray(checkData.checklist)) {
    errors.checklist = '체크리스트 데이터가 올바르지 않습니다.';
  }

  // 메모 길이 검증 (선택사항)
  if (checkData.notes && checkData.notes.length > 2000) {
    errors.notes = '특이사항은 2000자 이하로 입력해주세요.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * 날짜 포맷팅
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return '잘못된 날짜';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * 상대 시간 표시 (예: "5분 전", "2시간 전")
 */
export const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 30) return `${diffDays}일 전`;

  return formatDate(dateString);
};
