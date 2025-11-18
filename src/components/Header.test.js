import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

// Helper function to render with Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  test('헤더가 렌더링됨', () => {
    renderWithRouter(<Header />);

    const heading = screen.getByText(/소방 안전 앱/i);
    expect(heading).toBeInTheDocument();
  });

  test('모든 네비게이션 링크가 표시됨', () => {
    renderWithRouter(<Header />);

    expect(screen.getByText('홈')).toBeInTheDocument();
    expect(screen.getByText('긴급신고')).toBeInTheDocument();
    expect(screen.getByText('안전점검')).toBeInTheDocument();
    expect(screen.getByText('통계')).toBeInTheDocument();
  });

  test('네비게이션 링크가 올바른 경로를 가짐', () => {
    renderWithRouter(<Header />);

    const homeLink = screen.getByText('홈').closest('a');
    const emergencyLink = screen.getByText('긴급신고').closest('a');
    const safetyLink = screen.getByText('안전점검').closest('a');
    const statsLink = screen.getByText('통계').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(emergencyLink).toHaveAttribute('href', '/emergency');
    expect(safetyLink).toHaveAttribute('href', '/safety-check');
    expect(statsLink).toHaveAttribute('href', '/statistics');
  });

  test('로고 링크가 홈으로 연결됨', () => {
    renderWithRouter(<Header />);

    const logoLink = screen.getByText(/소방 안전 앱/).closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });
});
