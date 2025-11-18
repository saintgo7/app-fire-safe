import React, { useState } from 'react';
import storageService from '../services/storageService';
import { validateSafetyCheck, sanitizeInput } from '../utils/validation';
import './SafetyCheck.css';

function SafetyCheck() {
  const [checklist, setChecklist] = useState([
    { id: 1, item: '소화기 점검 (위치 확인, 압력 게이지 확인)', checked: false },
    { id: 2, item: '화재 경보기 테스트 (배터리 상태 확인)', checked: false },
    { id: 3, item: '비상구 확인 (장애물 없음, 표지판 정상)', checked: false },
    { id: 4, item: '전기 시설 점검 (과부하 방지, 손상된 코드 확인)', checked: false },
    { id: 5, item: '가스 시설 점검 (누출 확인, 밸브 상태)', checked: false },
    { id: 6, item: '화재 방지문 점검 (정상 작동 확인)', checked: false }
  ]);

  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckChange = (id) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setErrors({});

    const completedItems = checklist.filter(item => item.checked).length;
    const totalItems = checklist.length;
    const completionRate = Math.round((completedItems / totalItems) * 100);

    const checkData = {
      checklist,
      notes,
      completionRate,
      completedItems,
      totalItems
    };

    // 검증
    const validation = validateSafetyCheck(checkData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      alert('입력 내용을 확인해주세요.');
      return;
    }

    try {
      // 데이터 저장
      const sanitizedData = {
        ...checkData,
        notes: sanitizeInput(notes)
      };

      const savedCheck = storageService.saveSafetyCheck(sanitizedData);

      alert(`안전 점검 완료!\n\n점검 번호: ${savedCheck.id}\n점검률: ${completionRate}%\n완료 항목: ${completedItems}/${totalItems}\n\n점검 기록이 저장되었습니다.`);

      // 폼 초기화
      setChecklist(prev => prev.map(item => ({ ...item, checked: false })));
      setNotes('');
    } catch (error) {
      alert('안전 점검 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedCount = checklist.filter(item => item.checked).length;
  const totalCount = checklist.length;
  const completionRate = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="safety-check">
      <div className="safety-header">
        <h2>✅ 안전 점검</h2>
        <p>정기적인 안전 점검으로 화재를 예방하세요</p>
      </div>

      <div className="progress-section">
        <h3>점검 진행률</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <p>{completedCount}/{totalCount} 항목 완료 ({completionRate}%)</p>
      </div>

      <div className="checklist-section">
        <h3>안전 점검 항목</h3>
        <div className="checklist">
          {checklist.map(item => (
            <div key={item.id} className="checklist-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleCheckChange(item.id)}
                />
                <span className="checkmark"></span>
                {item.item}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="notes-section">
        <h3>특이사항 기록</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="점검 중 발견한 문제점이나 특이사항을 기록하세요..."
          rows="4"
          className={errors.notes ? 'input-error' : ''}
          maxLength="2000"
        />
        {errors.notes && <span className="error-message">{errors.notes}</span>}
        <div className="char-count">{notes.length}/2000</div>
      </div>

      <div className="submit-section">
        <button onClick={handleSubmit} className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : '점검 완료 보고'}
        </button>
      </div>
    </div>
  );
}

export default SafetyCheck;