import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h2>소방 안전을 위한 스마트 솔루션</h2>
        <p>화재 예방과 안전 관리를 위한 종합 관리 시스템</p>
      </section>

      <section className="features">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🚨 긴급 신고</h3>
            <p>화재 발생 시 즉시 신고하고 대응 조치를 받으세요</p>
            <Link to="/emergency" className="emergency-button">
              긴급 신고하기
            </Link>
          </div>

          <div className="feature-card">
            <h3>✅ 안전 점검</h3>
            <p>정기적인 안전 점검으로 화재를 예방하세요</p>
            <Link to="/safety-check" className="safety-button">
              안전 점검하기
            </Link>
          </div>

          <div className="feature-card">
            <h3>📊 통계 및 분석</h3>
            <p>안전 현황을 분석하고 개선 방안을 확인하세요</p>
            <button className="info-button">통계 보기</button>
          </div>
        </div>
      </section>

      <section className="quick-tips">
        <h3>화재 예방 팁</h3>
        <ul>
          <li>정기적으로 소화기 점검하기</li>
          <li>전기 콘센트 과부하 방지</li>
          <li>비상구 확인 및 유지</li>
          <li>화재 경보기 배터리 교체</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;