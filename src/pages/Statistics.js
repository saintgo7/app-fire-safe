import React, { useState, useEffect } from 'react';
import storageService from '../services/storageService';
import { formatDate, getRelativeTime } from '../utils/validation';
import './Statistics.css';

function Statistics() {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, reports, checks

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = () => {
    const statistics = storageService.getStatistics();
    setStats(statistics);
  };

  const handleClearData = () => {
    if (window.confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      storageService.clearAll();
      loadStatistics();
      alert('모든 데이터가 삭제되었습니다.');
    }
  };

  const handleExportData = () => {
    const data = storageService.exportData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fire-safety-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteReport = (id) => {
    if (window.confirm('이 신고 기록을 삭제하시겠습니까?')) {
      storageService.deleteEmergencyReport(id);
      loadStatistics();
      alert('신고 기록이 삭제되었습니다.');
    }
  };

  const handleDeleteCheck = (id) => {
    if (window.confirm('이 점검 기록을 삭제하시겠습니까?')) {
      storageService.deleteSafetyCheck(id);
      loadStatistics();
      alert('점검 기록이 삭제되었습니다.');
    }
  };

  if (!stats) {
    return <div className="statistics">데이터를 불러오는 중...</div>;
  }

  const getSeverityLabel = (severity) => {
    const labels = {
      low: '낮음',
      medium: '보통',
      high: '높음',
      critical: '매우 위험'
    };
    return labels[severity] || severity;
  };

  const getSeverityClass = (severity) => {
    return `severity-${severity}`;
  };

  return (
    <div className="statistics">
      <div className="stats-header">
        <h2>📊 통계 및 분석</h2>
        <p>안전 현황을 분석하고 개선 방안을 확인하세요</p>
      </div>

      <div className="stats-actions">
        <button onClick={handleExportData} className="export-button">
          💾 데이터 내보내기
        </button>
        <button onClick={handleClearData} className="clear-button">
          🗑️ 전체 데이터 삭제
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          전체 개요
        </button>
        <button
          className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          긴급 신고 이력
        </button>
        <button
          className={`tab ${activeTab === 'checks' ? 'active' : ''}`}
          onClick={() => setActiveTab('checks')}
        >
          안전 점검 이력
        </button>
      </div>

      {/* 전체 개요 탭 */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>긴급 신고</h3>
              <div className="stat-number">{stats.reports.total}</div>
              <p>총 신고 건수</p>
            </div>

            <div className="stat-card">
              <h3>안전 점검</h3>
              <div className="stat-number">{stats.checks.total}</div>
              <p>총 점검 건수</p>
            </div>

            <div className="stat-card">
              <h3>평균 점검률</h3>
              <div className="stat-number">{stats.checks.averageCompletionRate}%</div>
              <p>안전 점검 완료율</p>
            </div>
          </div>

          <div className="severity-breakdown">
            <h3>긴급 신고 위험도 분포</h3>
            <div className="severity-chart">
              <div className="severity-item">
                <span className="severity-label">매우 위험</span>
                <div className="severity-bar">
                  <div
                    className="severity-fill critical"
                    style={{ width: `${stats.reports.total > 0 ? (stats.reports.bySeverity.critical / stats.reports.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="severity-count">{stats.reports.bySeverity.critical}건</span>
              </div>
              <div className="severity-item">
                <span className="severity-label">높음</span>
                <div className="severity-bar">
                  <div
                    className="severity-fill high"
                    style={{ width: `${stats.reports.total > 0 ? (stats.reports.bySeverity.high / stats.reports.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="severity-count">{stats.reports.bySeverity.high}건</span>
              </div>
              <div className="severity-item">
                <span className="severity-label">보통</span>
                <div className="severity-bar">
                  <div
                    className="severity-fill medium"
                    style={{ width: `${stats.reports.total > 0 ? (stats.reports.bySeverity.medium / stats.reports.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="severity-count">{stats.reports.bySeverity.medium}건</span>
              </div>
              <div className="severity-item">
                <span className="severity-label">낮음</span>
                <div className="severity-bar">
                  <div
                    className="severity-fill low"
                    style={{ width: `${stats.reports.total > 0 ? (stats.reports.bySeverity.low / stats.reports.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="severity-count">{stats.reports.bySeverity.low}건</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 긴급 신고 이력 탭 */}
      {activeTab === 'reports' && (
        <div className="tab-content">
          <h3>최근 긴급 신고 ({stats.reports.total}건)</h3>
          {stats.reports.recent.length === 0 ? (
            <div className="empty-state">
              <p>아직 신고 이력이 없습니다.</p>
            </div>
          ) : (
            <div className="report-list">
              {storageService.getEmergencyReports().reverse().map(report => (
                <div key={report.id} className="report-item">
                  <div className="report-header">
                    <span className={`severity-badge ${getSeverityClass(report.severity)}`}>
                      {getSeverityLabel(report.severity)}
                    </span>
                    <span className="report-time">{getRelativeTime(report.timestamp)}</span>
                  </div>
                  <div className="report-body">
                    <p><strong>위치:</strong> {report.location}</p>
                    <p><strong>상황:</strong> {report.description}</p>
                    <p><strong>연락처:</strong> {report.contact}</p>
                    <p className="report-timestamp">
                      <strong>신고 시각:</strong> {formatDate(report.timestamp)}
                    </p>
                  </div>
                  <div className="report-actions">
                    <span className="report-id">ID: {report.id}</span>
                    <button onClick={() => handleDeleteReport(report.id)} className="delete-button">
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 안전 점검 이력 탭 */}
      {activeTab === 'checks' && (
        <div className="tab-content">
          <h3>최근 안전 점검 ({stats.checks.total}건)</h3>
          {stats.checks.recent.length === 0 ? (
            <div className="empty-state">
              <p>아직 점검 이력이 없습니다.</p>
            </div>
          ) : (
            <div className="check-list">
              {storageService.getSafetyChecks().reverse().map(check => (
                <div key={check.id} className="check-item">
                  <div className="check-header">
                    <span className="completion-badge">
                      완료율: {check.completionRate}%
                    </span>
                    <span className="check-time">{getRelativeTime(check.timestamp)}</span>
                  </div>
                  <div className="check-body">
                    <p><strong>완료 항목:</strong> {check.completedItems}/{check.totalItems}</p>
                    {check.notes && (
                      <div className="check-notes">
                        <strong>특이사항:</strong>
                        <p>{check.notes}</p>
                      </div>
                    )}
                    <p className="check-timestamp">
                      <strong>점검 시각:</strong> {formatDate(check.timestamp)}
                    </p>
                  </div>
                  <div className="check-actions">
                    <span className="check-id">ID: {check.id}</span>
                    <button onClick={() => handleDeleteCheck(check.id)} className="delete-button">
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Statistics;
