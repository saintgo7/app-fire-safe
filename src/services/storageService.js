// LocalStorage 기반 데이터 영속성 서비스

const STORAGE_KEYS = {
  EMERGENCY_REPORTS: 'fire_safety_emergency_reports',
  SAFETY_CHECKS: 'fire_safety_safety_checks'
};

class StorageService {
  // 긴급 신고 관련 메서드
  saveEmergencyReport(report) {
    try {
      const reports = this.getEmergencyReports();
      const newReport = {
        id: this.generateId(),
        ...report,
        timestamp: new Date().toISOString(),
        status: 'submitted'
      };
      reports.push(newReport);
      localStorage.setItem(STORAGE_KEYS.EMERGENCY_REPORTS, JSON.stringify(reports));
      return newReport;
    } catch (error) {
      throw new Error('긴급 신고 저장에 실패했습니다.');
    }
  }

  getEmergencyReports() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMERGENCY_REPORTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  getEmergencyReportById(id) {
    const reports = this.getEmergencyReports();
    return reports.find(report => report.id === id);
  }

  deleteEmergencyReport(id) {
    try {
      const reports = this.getEmergencyReports();
      const filteredReports = reports.filter(report => report.id !== id);
      localStorage.setItem(STORAGE_KEYS.EMERGENCY_REPORTS, JSON.stringify(filteredReports));
      return true;
    } catch (error) {
      throw new Error('긴급 신고 삭제에 실패했습니다.');
    }
  }

  // 안전 점검 관련 메서드
  saveSafetyCheck(checkData) {
    try {
      const checks = this.getSafetyChecks();
      const newCheck = {
        id: this.generateId(),
        ...checkData,
        timestamp: new Date().toISOString()
      };
      checks.push(newCheck);
      localStorage.setItem(STORAGE_KEYS.SAFETY_CHECKS, JSON.stringify(checks));
      return newCheck;
    } catch (error) {
      throw new Error('안전 점검 저장에 실패했습니다.');
    }
  }

  getSafetyChecks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAFETY_CHECKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  getSafetyCheckById(id) {
    const checks = this.getSafetyChecks();
    return checks.find(check => check.id === id);
  }

  deleteSafetyCheck(id) {
    try {
      const checks = this.getSafetyChecks();
      const filteredChecks = checks.filter(check => check.id !== id);
      localStorage.setItem(STORAGE_KEYS.SAFETY_CHECKS, JSON.stringify(filteredChecks));
      return true;
    } catch (error) {
      throw new Error('안전 점검 삭제에 실패했습니다.');
    }
  }

  // 통계 관련 메서드
  getStatistics() {
    const reports = this.getEmergencyReports();
    const checks = this.getSafetyChecks();

    // 긴급 신고 통계
    const reportStats = {
      total: reports.length,
      bySeverity: {
        low: reports.filter(r => r.severity === 'low').length,
        medium: reports.filter(r => r.severity === 'medium').length,
        high: reports.filter(r => r.severity === 'high').length,
        critical: reports.filter(r => r.severity === 'critical').length
      },
      recent: reports.slice(-5).reverse() // 최근 5개
    };

    // 안전 점검 통계
    const checkStats = {
      total: checks.length,
      averageCompletionRate: checks.length > 0
        ? Math.round(checks.reduce((sum, check) => sum + check.completionRate, 0) / checks.length)
        : 0,
      recent: checks.slice(-5).reverse() // 최근 5개
    };

    return {
      reports: reportStats,
      checks: checkStats,
      lastUpdated: new Date().toISOString()
    };
  }

  // 유틸리티 메서드
  generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  clearAll() {
    localStorage.removeItem(STORAGE_KEYS.EMERGENCY_REPORTS);
    localStorage.removeItem(STORAGE_KEYS.SAFETY_CHECKS);
  }

  exportData() {
    return {
      emergencyReports: this.getEmergencyReports(),
      safetyChecks: this.getSafetyChecks(),
      exportedAt: new Date().toISOString()
    };
  }

  importData(data) {
    try {
      if (data.emergencyReports) {
        localStorage.setItem(STORAGE_KEYS.EMERGENCY_REPORTS, JSON.stringify(data.emergencyReports));
      }
      if (data.safetyChecks) {
        localStorage.setItem(STORAGE_KEYS.SAFETY_CHECKS, JSON.stringify(data.safetyChecks));
      }
      return true;
    } catch (error) {
      throw new Error('데이터 가져오기에 실패했습니다.');
    }
  }
}

// 싱글톤 인스턴스 export
const storageService = new StorageService();
export default storageService;
