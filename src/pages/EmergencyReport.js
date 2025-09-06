import React, { useState } from 'react';
import './EmergencyReport.css';

function EmergencyReport() {
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    severity: 'medium',
    contact: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('긴급 신고가 접수되었습니다. 곧 대응팀이 출동합니다.');
    console.log('Emergency report:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">상황 설명 *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="화재 상황을 자세히 설명해주세요"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="severity">위험도</label>
          <select
            id="severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
          >
            <option value="low">낮음</option>
            <option value="medium">보통</option>
            <option value="high">높음</option>
            <option value="critical">매우 위험</option>
          </select>
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
            required
          />
        </div>

        <button type="submit" className="submit-button">
          긴급 신고 접수
        </button>
      </form>
    </div>
  );
}

export default EmergencyReport;