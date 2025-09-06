import React, { useState } from 'react';
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

  const handleCheckChange = (id) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleSubmit = () => {
    const completedItems = checklist.filter(item => item.checked).length;
    const totalItems = checklist.length;
    const percentage = Math.round((completedItems / totalItems) * 100);
    
    alert(`안전 점검 완료!\n점검률: ${percentage}%\n완료 항목: ${completedItems}/${totalItems}`);
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
        />
      </div>

      <div className="submit-section">
        <button onClick={handleSubmit} className="submit-button">
          점검 완료 보고
        </button>
      </div>
    </div>
  );
}

export default SafetyCheck;