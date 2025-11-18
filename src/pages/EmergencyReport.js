import React, { useState } from 'react';
import storageService from '../services/storageService';
import { validateEmergencyReport, sanitizeInput } from '../utils/validation';
import './EmergencyReport.css';

function EmergencyReport() {
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    severity: 'medium',
    contact: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // 입력 검증
    const validation = validateEmergencyReport(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // 데이터 저장 (XSS 방지를 위해 sanitize)
      const sanitizedData = {
        location: sanitizeInput(formData.location),
        description: sanitizeInput(formData.description),
        severity: formData.severity,
        contact: sanitizeInput(formData.contact)
      };

      const savedReport = storageService.saveEmergencyReport(sanitizedData);

      alert(`긴급 신고가 접수되었습니다.\n신고번호: ${savedReport.id}\n\n곧 대응팀이 출동합니다.`);

      // 폼 초기화
      setFormData({
        location: '',
        description: '',
        severity: 'medium',
        contact: ''
      });
    } catch (error) {
      alert('신고 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // 에러 메시지 제거 (해당 필드 수정 시)
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <div className="emergency-report">
      <div className="emergency-header">
        <h2>🚨 긴급 신고</h2>
        <p>화재 발생 시 즉시 신고해주세요</p>
      </div>

      <div className="emergency-actions">
        <button className="call-119" onClick={() => window.location.href = 'tel:119'}>
          🚨 119 직접 신고
        </button>
      </div>

      <form onSubmit={handleSubmit} className="emergency-form">
        <div className="form-group">
          <label htmlFor="location">발생 위치 *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="상세한 주소를 입력하세요"
            className={errors.location ? 'input-error' : ''}
            required
          />
          {errors.location && <span className="error-message">{errors.location}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">상황 설명 *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="화재 상황을 자세히 설명해주세요 (최소 10자 이상)"
            rows="4"
            className={errors.description ? 'input-error' : ''}
            required
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="severity">위험도</label>
          <select
            id="severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className={errors.severity ? 'input-error' : ''}
          >
            <option value="low">낮음</option>
            <option value="medium">보통</option>
            <option value="high">높음</option>
            <option value="critical">매우 위험</option>
          </select>
          {errors.severity && <span className="error-message">{errors.severity}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contact">연락처 *</label>
          <input
            type="tel"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="010-1234-5678"
            className={errors.contact ? 'input-error' : ''}
            required
          />
          {errors.contact && <span className="error-message">{errors.contact}</span>}
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? '신고 접수 중...' : '긴급 신고 접수'}
        </button>
      </form>
    </div>
  );
}

export default EmergencyReport;