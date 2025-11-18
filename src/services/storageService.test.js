import storageService from './storageService';

describe('StorageService', () => {
  beforeEach(() => {
    // 각 테스트 전에 localStorage 초기화
    storageService.clearAll();
  });

  afterEach(() => {
    // 각 테스트 후에 localStorage 초기화
    storageService.clearAll();
  });

  describe('Emergency Reports', () => {
    test('긴급 신고 저장', () => {
      const report = {
        location: '서울시 강남구',
        description: '화재 발생',
        severity: 'high',
        contact: '010-1234-5678'
      };

      const saved = storageService.saveEmergencyReport(report);

      expect(saved).toHaveProperty('id');
      expect(saved).toHaveProperty('timestamp');
      expect(saved.location).toBe(report.location);
      expect(saved.severity).toBe(report.severity);
    });

    test('긴급 신고 조회', () => {
      const report = {
        location: '서울시 강남구',
        description: '화재 발생',
        severity: 'high',
        contact: '010-1234-5678'
      };

      const saved = storageService.saveEmergencyReport(report);
      const reports = storageService.getEmergencyReports();

      expect(reports).toHaveLength(1);
      expect(reports[0].id).toBe(saved.id);
    });

    test('긴급 신고 삭제', () => {
      const report = {
        location: '서울시 강남구',
        description: '화재 발생',
        severity: 'high',
        contact: '010-1234-5678'
      };

      const saved = storageService.saveEmergencyReport(report);
      const result = storageService.deleteEmergencyReport(saved.id);

      expect(result).toBe(true);

      const reports = storageService.getEmergencyReports();
      expect(reports).toHaveLength(0);
    });

    test('ID로 긴급 신고 조회', () => {
      const report = {
        location: '서울시 강남구',
        description: '화재 발생',
        severity: 'high',
        contact: '010-1234-5678'
      };

      const saved = storageService.saveEmergencyReport(report);
      const found = storageService.getEmergencyReportById(saved.id);

      expect(found).toBeDefined();
      expect(found.id).toBe(saved.id);
      expect(found.location).toBe(report.location);
    });
  });

  describe('Safety Checks', () => {
    test('안전 점검 저장', () => {
      const check = {
        checklist: [
          { id: 1, item: '소화기 점검', checked: true },
          { id: 2, item: '화재 경보기', checked: false }
        ],
        notes: '특이사항 없음',
        completionRate: 50,
        completedItems: 1,
        totalItems: 2
      };

      const saved = storageService.saveSafetyCheck(check);

      expect(saved).toHaveProperty('id');
      expect(saved).toHaveProperty('timestamp');
      expect(saved.completionRate).toBe(50);
      expect(saved.notes).toBe(check.notes);
    });

    test('안전 점검 조회', () => {
      const check = {
        checklist: [],
        notes: '특이사항 없음',
        completionRate: 100,
        completedItems: 6,
        totalItems: 6
      };

      const saved = storageService.saveSafetyCheck(check);
      const checks = storageService.getSafetyChecks();

      expect(checks).toHaveLength(1);
      expect(checks[0].id).toBe(saved.id);
    });

    test('안전 점검 삭제', () => {
      const check = {
        checklist: [],
        notes: '',
        completionRate: 0,
        completedItems: 0,
        totalItems: 6
      };

      const saved = storageService.saveSafetyCheck(check);
      const result = storageService.deleteSafetyCheck(saved.id);

      expect(result).toBe(true);

      const checks = storageService.getSafetyChecks();
      expect(checks).toHaveLength(0);
    });
  });

  describe('Statistics', () => {
    test('통계 데이터 생성', () => {
      // 긴급 신고 추가
      storageService.saveEmergencyReport({
        location: '서울',
        description: '화재',
        severity: 'high',
        contact: '010-1234-5678'
      });

      storageService.saveEmergencyReport({
        location: '부산',
        description: '화재',
        severity: 'medium',
        contact: '010-9876-5432'
      });

      // 안전 점검 추가
      storageService.saveSafetyCheck({
        checklist: [],
        notes: '',
        completionRate: 80,
        completedItems: 4,
        totalItems: 5
      });

      const stats = storageService.getStatistics();

      expect(stats.reports.total).toBe(2);
      expect(stats.reports.bySeverity.high).toBe(1);
      expect(stats.reports.bySeverity.medium).toBe(1);
      expect(stats.checks.total).toBe(1);
      expect(stats.checks.averageCompletionRate).toBe(80);
    });

    test('빈 데이터에 대한 통계', () => {
      const stats = storageService.getStatistics();

      expect(stats.reports.total).toBe(0);
      expect(stats.checks.total).toBe(0);
      expect(stats.checks.averageCompletionRate).toBe(0);
    });
  });

  describe('Data Export/Import', () => {
    test('데이터 내보내기', () => {
      storageService.saveEmergencyReport({
        location: '서울',
        description: '화재',
        severity: 'high',
        contact: '010-1234-5678'
      });

      const exported = storageService.exportData();

      expect(exported).toHaveProperty('emergencyReports');
      expect(exported).toHaveProperty('safetyChecks');
      expect(exported).toHaveProperty('exportedAt');
      expect(exported.emergencyReports).toHaveLength(1);
    });

    test('데이터 가져오기', () => {
      const data = {
        emergencyReports: [
          {
            id: 'test-1',
            location: '서울',
            description: '화재',
            severity: 'high',
            contact: '010-1234-5678',
            timestamp: new Date().toISOString()
          }
        ],
        safetyChecks: []
      };

      const result = storageService.importData(data);

      expect(result).toBe(true);

      const reports = storageService.getEmergencyReports();
      expect(reports).toHaveLength(1);
      expect(reports[0].id).toBe('test-1');
    });
  });

  describe('Utility Methods', () => {
    test('ID 생성', () => {
      const id1 = storageService.generateId();
      const id2 = storageService.generateId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });

    test('전체 데이터 삭제', () => {
      storageService.saveEmergencyReport({
        location: '서울',
        description: '화재',
        severity: 'high',
        contact: '010-1234-5678'
      });

      storageService.saveSafetyCheck({
        checklist: [],
        notes: '',
        completionRate: 100,
        completedItems: 6,
        totalItems: 6
      });

      storageService.clearAll();

      const reports = storageService.getEmergencyReports();
      const checks = storageService.getSafetyChecks();

      expect(reports).toHaveLength(0);
      expect(checks).toHaveLength(0);
    });
  });
});
