import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  test('홈 페이지가 렌더링됨', () => {
    renderWithRouter(<Home />);

    expect(screen.getByText(/소방 안전을 위한 스마트 솔루션/i)).toBeInTheDocument();
  });

  test('히어로 섹션이 표시됨', () => {
    renderWithRouter(<Home />);

    expect(screen.getByText(/화재 예방과 안전 관리를 위한 종합 관리 시스템/i)).toBeInTheDocument();
  });

  test('3개의 기능 카드가 표시됨', () => {
    renderWithRouter(<Home />);

    // 정확한 텍스트 매칭으로 중복 방지
    expect(screen.getByText('긴급 신고하기')).toBeInTheDocument();
    expect(screen.getByText('안전 점검하기')).toBeInTheDocument();
    expect(screen.getByText('통계 보기')).toBeInTheDocument();
  });

  test('긴급 신고 버튼이 올바른 경로로 연결됨', () => {
    renderWithRouter(<Home />);

    const emergencyButton = screen.getByText('긴급 신고하기').closest('a');
    expect(emergencyButton).toHaveAttribute('href', '/emergency');
  });

  test('안전 점검 버튼이 올바른 경로로 연결됨', () => {
    renderWithRouter(<Home />);

    const safetyButton = screen.getByText('안전 점검하기').closest('a');
    expect(safetyButton).toHaveAttribute('href', '/safety-check');
  });

  test('통계 버튼이 올바른 경로로 연결됨', () => {
    renderWithRouter(<Home />);

    const statsButton = screen.getByText('통계 보기').closest('a');
    expect(statsButton).toHaveAttribute('href', '/statistics');
  });

  test('화재 예방 팁이 표시됨', () => {
    renderWithRouter(<Home />);

    expect(screen.getByText(/화재 예방 팁/i)).toBeInTheDocument();
    expect(screen.getByText(/정기적으로 소화기 점검하기/i)).toBeInTheDocument();
    expect(screen.getByText(/전기 콘센트 과부하 방지/i)).toBeInTheDocument();
    expect(screen.getByText(/비상구 확인 및 유지/i)).toBeInTheDocument();
    expect(screen.getByText(/화재 경보기 배터리 교체/i)).toBeInTheDocument();
  });
});
