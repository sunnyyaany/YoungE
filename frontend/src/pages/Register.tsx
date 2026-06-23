import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Moon, Sun } from 'lucide-react';
import { authAPI } from '../utils/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    gender: 'F', // M or F
    birthDate: '',
    birthTime: '',
    isLunar: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleGenderSelect = (gender: string) => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Backend expects: phoneNumber, password, name, gender, birthDateString
      const payload = {
        phoneNumber: formData.phoneNumber,
        password: formData.password || '1234', // default simple password if not provided
        name: formData.name,
        gender: formData.gender,
        birthDateString: `${formData.birthDate}${formData.birthTime ? 'T' + formData.birthTime + ':00' : 'T00:00:00'}`
      };

      const response = await authAPI.register(payload);
      
      // Store token
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.id);
      
      navigate('/');
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Sparkles size={40} className="text-lavender mystical-float" style={{ margin: '0 auto', marginBottom: '16px' }} />
        <h1 className="text-gradient" style={{ fontSize: '28px', marginBottom: '8px' }}>나의 우주를 찾아서</h1>
        <p className="text-muted" style={{ fontSize: '14px' }}>연이아씨에 오신 것을 환영합니다.<br/>정확한 사주 분석을 위해 정보를 입력해주세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {error && <div style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--color-primary-light)' }}>이름</label>
          <input 
            type="text" 
            name="name"
            placeholder="홍길동" 
            className="input-glass" 
            value={formData.name}
            onChange={handleChange}
            required 
            disabled={loading}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--color-primary-light)' }}>휴대폰 번호</label>
          <input 
            type="tel" 
            name="phoneNumber"
            placeholder="010-0000-0000" 
            className="input-glass" 
            value={formData.phoneNumber}
            onChange={handleChange}
            required 
            disabled={loading}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--color-primary-light)' }}>성별</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="button" 
              onClick={() => handleGenderSelect('female')}
              className="input-glass" 
              style={{ 
                flex: 1, 
                textAlign: 'center', 
                borderColor: formData.gender === 'female' ? 'var(--color-primary)' : 'var(--border-glassStrong)',
                background: formData.gender === 'female' ? 'rgba(192, 132, 252, 0.2)' : 'rgba(20, 15, 35, 0.5)'
              }}
            >
              여성
            </button>
            <button 
              type="button" 
              onClick={() => handleGenderSelect('male')}
              className="input-glass" 
              style={{ 
                flex: 1, 
                textAlign: 'center',
                borderColor: formData.gender === 'male' ? 'var(--color-primary)' : 'var(--border-glassStrong)',
                background: formData.gender === 'male' ? 'rgba(192, 132, 252, 0.2)' : 'rgba(20, 15, 35, 0.5)'
              }}
            >
              남성
            </button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--color-primary-light)' }}>생년월일</label>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <button 
              type="button" 
              onClick={() => setFormData(prev => ({...prev, isLunar: false}))}
              className="input-glass" 
              style={{ 
                flex: 1, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                borderColor: !formData.isLunar ? 'var(--color-primary)' : 'var(--border-glassStrong)',
                background: !formData.isLunar ? 'rgba(192, 132, 252, 0.2)' : 'rgba(20, 15, 35, 0.5)'
              }}
            >
              <Sun size={16} /> 양력
            </button>
            <button 
              type="button" 
              onClick={() => setFormData(prev => ({...prev, isLunar: true}))}
              className="input-glass" 
              style={{ 
                flex: 1, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                borderColor: formData.isLunar ? 'var(--color-primary)' : 'var(--border-glassStrong)',
                background: formData.isLunar ? 'rgba(192, 132, 252, 0.2)' : 'rgba(20, 15, 35, 0.5)'
              }}
            >
              <Moon size={16} /> 음력
            </button>
          </div>
          <input 
            type="date" 
            name="birthDate"
            className="input-glass" 
            value={formData.birthDate}
            onChange={handleChange}
            required 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--color-primary-light)' }}>태어난 시간 (모르면 미입력)</label>
          <input 
            type="time" 
            name="birthTime"
            className="input-glass" 
            value={formData.birthTime}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-premium" style={{ marginTop: '12px' }}>
          운명 분석 시작하기 <Sparkles size={18} />
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <p className="text-muted" style={{ fontSize: '14px' }}>
          이미 연이아씨 회원이신가요? <br/>
          <Link to="/login" className="text-lavender" style={{ textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginTop: '8px' }}>로그인하기</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
