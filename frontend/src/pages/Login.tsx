import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { authAPI } from '../utils/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.login(phone);
      // 토큰 및 유저 정보 저장
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('tier', response.tier);
      
      // 메인 대시보드로 이동
      navigate('/');
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다. 번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Sparkles size={48} className="text-lavender mystical-float" style={{ margin: '0 auto', marginBottom: '20px' }} />
        <h1 className="text-gradient" style={{ fontSize: '32px', marginBottom: '12px' }}>연이아씨</h1>
        <p className="text-muted" style={{ fontSize: '15px' }}>당신의 우주를 다시 연결합니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {error && <div style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--color-primary-light)' }}>휴대폰 번호</label>
          <input 
            type="tel" 
            placeholder="010-0000-0000" 
            className="input-glass" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required 
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn-premium" style={{ marginTop: '16px' }} disabled={loading}>
          {loading ? '연결 중...' : '접속하기'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <p className="text-muted" style={{ fontSize: '14px' }}>
          아직 연이아씨 회원이 아니신가요? <br/>
          <Link to="/register" className="text-lavender" style={{ textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginTop: '8px' }}>나의 우주 찾기 (회원가입)</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
