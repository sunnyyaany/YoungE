import React, { useState, useEffect } from 'react';
import { Sparkles, Star, Loader2 } from 'lucide-react';
import guideImage from '../assets/guide.png';
import { contentAPI } from '../utils/api';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

const mockFiveElementsData = [
  { subject: '목(木)', A: 80, fullMark: 100 },
  { subject: '화(火)', A: 40, fullMark: 100 },
  { subject: '토(土)', A: 60, fullMark: 100 },
  { subject: '금(金)', A: 90, fullMark: 100 },
  { subject: '수(水)', A: 30, fullMark: 100 },
];

const Dashboard: React.FC = () => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [dailyCard, setDailyCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyCard = async () => {
      try {
        const response = await contentAPI.getDailyCard();
        setDailyCard(response.content); // 백엔드에서 반환하는 AI 콘텐츠 텍스트
      } catch (error) {
        console.error('Failed to fetch daily card:', error);
        // 오류 시 기본 모의 데이터 표시
        setDailyCard("오늘 당신의 금(金) 기운이 강하게 작용하여, 오랫동안 준비했던 일에서 뜻밖의 결실을 맺을 수 있습니다. 오후 3시경, 귀인(貴人)과의 만남이 있으니 타인의 조언에 귀를 기울이세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchDailyCard();
  }, []);

  return (
    <div className="page-enter" style={{ paddingBottom: '20px' }}>
      
      {/* Header */}
      <header className="header" style={{ margin: '-24px -24px 24px -24px' }}>
        <h1 className="header-title text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} className="text-lavender" /> 연이아씨
        </h1>
      </header>

      {/* Guide Section */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
          <img 
            src={guideImage} 
            alt="Guide" 
            className="mystical-float"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              borderRadius: '50%',
              border: '2px solid rgba(192, 132, 252, 0.4)',
              boxShadow: '0 0 20px rgba(192, 132, 252, 0.3)'
            }} 
          />
        </div>
        <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px 16px 16px 0', position: 'relative' }}>
          <p className="text-main" style={{ fontSize: '14px', lineHeight: '1.5' }}>
            "어서오세요. 당신의 사주 원국에 깃든 별빛을 읽어드릴게요. 오늘은 어떤 운명의 카드가 기다리고 있을까요?"
          </p>
        </div>
      </div>

      {/* Tarot Card Section for Daily Fortune */}
      <h2 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Star size={18} className="text-gold" /> 오늘의 운명 카드
      </h2>
      
      <div 
        style={{ 
          perspective: '1000px', 
          height: '320px', 
          marginBottom: '32px',
          cursor: 'pointer'
        }}
        onClick={() => setIsCardFlipped(!isCardFlipped)}
      >
        <div 
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transition: 'transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)',
            transformStyle: 'preserve-3d',
            transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0)'
          }}
        >
          {/* Card Back (Unflipped) */}
          <div 
            className="glass-panel"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px solid rgba(252, 211, 77, 0.4)',
              boxShadow: '0 0 30px rgba(252, 211, 77, 0.15)',
              background: 'linear-gradient(135deg, rgba(30,20,50,0.8), rgba(62,41,102,0.8))'
            }}
          >
            {loading ? (
              <Loader2 size={48} className="text-gold mystical-float" style={{ animation: 'spin 2s linear infinite' }} />
            ) : (
              <Sparkles size={48} className="text-gold mystical-float" />
            )}
            <p style={{ marginTop: '16px', color: 'var(--color-text-gold)', letterSpacing: '2px' }}>
              {loading ? '운명의 별빛을 읽는 중...' : '카드를 탭하여 뒤집기'}
            </p>
          </div>

          {/* Card Front (Flipped) */}
          <div 
            className="glass-panel"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              border: '2px solid rgba(192, 132, 252, 0.5)',
              background: 'linear-gradient(135deg, rgba(62,41,102,0.9), rgba(30,20,50,0.9))',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '16px', textAlign: 'center' }}>
              <span className="text-lavender" style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px' }}>THE EMPRESS</span>
              <h3 className="text-gradient" style={{ fontSize: '24px', marginTop: '4px' }}>오늘의 흐름</h3>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', flex: 1, overflowY: 'auto' }}>
              {dailyCard}
            </p>
            <div style={{ marginTop: 'auto', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '12px' }}>
              행운의 색: 연보라색 &nbsp;|&nbsp; 행운의 방향: 서쪽
            </div>
          </div>
        </div>
      </div>

      {/* Ohang Radar Chart */}
      <h2 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={18} className="text-lavender" /> 나의 오행 레이더
      </h2>
      <div className="glass-panel" style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockFiveElementsData}>
            <PolarGrid stroke="rgba(192, 132, 252, 0.2)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-main)', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="My Ohang"
              dataKey="A"
              stroke="var(--color-primary)"
              fill="var(--color-primary-glow)"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Dashboard;
