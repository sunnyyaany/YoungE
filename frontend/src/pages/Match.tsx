import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, X, Star, Loader2 } from 'lucide-react';
import { matchAPI } from '../utils/api';

const Match: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await matchAPI.getRecommendations();
        // Backend returns an array of matched users in `matches`
        const apiMatches = response.matches.map((m: any, index: number) => ({
          id: m.userId,
          name: m.name,
          age: m.age,
          score: m.totalScore,
          keyElement: "오행 조화도: " + m.details.fiveElementsScore + "점", // Simplified for now
          description: `일간 점수 ${m.details.ilganScore}점, 지지 관계 ${m.details.jijiScore}점. 연이아씨가 추천하는 당신의 운명의 카드입니다.`,
          arcana: ["THE LOVERS", "THE STAR", "THE HIEROPHANT", "THE SUN", "THE WORLD"][index % 5],
          color: ["rgba(168, 85, 247, 0.8)", "rgba(59, 130, 246, 0.8)", "rgba(217, 119, 6, 0.8)"][index % 3]
        }));
        setMatches(apiMatches);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (matches.length === 0) return;
    
    setSwipeDirection(direction);
    
    // Animate out, then remove card
    setTimeout(() => {
      setMatches(prev => prev.slice(1));
      setSwipeDirection(null);
    }, 400);
  };

  return (
    <div className="page-enter" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '20px' }}>
      {/* Header */}
      <header className="header" style={{ margin: '-24px -24px 24px -24px' }}>
        <h1 className="header-title text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Star size={20} className="text-gold" /> 운명의 카드
        </h1>
      </header>
      
      <p className="text-muted" style={{ textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
        당신의 우주와 조화를 이루는<br/>인연의 카드들을 확인해보세요.
      </p>

      {/* Card Stack Container */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        {loading ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Loader2 size={48} className="text-lavender mystical-float" style={{ margin: '0 auto 16px', animation: 'spin 2s linear infinite' }} />
            <h3 className="text-main" style={{ marginBottom: '8px' }}>운명의 실타래를 엮는 중...</h3>
          </div>
        ) : matches.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Sparkles size={48} className="text-lavender mystical-float" style={{ margin: '0 auto 16px' }} />
            <h3 className="text-main" style={{ marginBottom: '8px' }}>새로운 인연을 찾는 중</h3>
            <p className="text-muted" style={{ fontSize: '14px' }}>더 많은 운명의 카드를<br/>불러오고 있습니다...</p>
          </div>
        ) : (
          matches.map((match, index) => {
            const isTop = index === 0;
            // Only show top 2 cards for performance and stacked look
            if (index > 1) return null;
            
            let transform = `scale(${1 - index * 0.05}) translateY(${index * 15}px)`;
            let opacity = 1 - index * 0.2;
            let transition = 'all 0.4s cubic-bezier(0.4, 0.2, 0.2, 1)';

            if (isTop && swipeDirection === 'right') {
              transform = `translateX(150%) rotate(20deg)`;
              opacity = 0;
            } else if (isTop && swipeDirection === 'left') {
              transform = `translateX(-150%) rotate(-20deg)`;
              opacity = 0;
            }

            return (
              <div
                key={match.id}
                className="glass-panel"
                style={{
                  position: 'absolute',
                  width: '100%',
                  maxWidth: '320px',
                  height: '460px',
                  transform,
                  opacity,
                  transition,
                  zIndex: matches.length - index,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  border: `2px solid ${isTop ? 'rgba(192, 132, 252, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                  background: `linear-gradient(135deg, rgba(43,27,74,0.95), rgba(20,15,35,0.95))`
                }}
              >
                {/* Top Image / Aura Placeholder */}
                <div style={{ 
                  height: '45%', 
                  background: `linear-gradient(to bottom, ${match.color}, transparent)`,
                  borderRadius: '24px 24px 0 0',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'rgba(0,0,0,0.4)', borderRadius: '20px', padding: '4px 12px',
                    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <Heart size={14} className="text-lavender" fill="var(--color-primary)" />
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{match.score}점 궁합</span>
                  </div>
                  <Sparkles size={64} style={{ color: 'rgba(255,255,255,0.3)' }} className="mystical-float" />
                </div>

                {/* Card Info */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '16px' }}>
                    <span className="text-gold" style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>{match.arcana}</span>
                    <h2 style={{ fontSize: '24px', margin: '4px 0' }}>{match.name} <span style={{ fontSize: '16px', fontWeight: 'normal', color: 'var(--color-text-muted)' }}>{match.age}</span></h2>
                    <span className="text-lavender" style={{ fontSize: '13px', display: 'inline-block', background: 'rgba(192, 132, 252, 0.2)', padding: '2px 8px', borderRadius: '4px' }}>{match.keyElement}</span>
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)' }}>
                    {match.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '32px' }}>
        <button 
          onClick={() => handleSwipe('left')}
          style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(20, 15, 35, 0.6)', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            color: 'var(--color-text-muted)', cursor: 'pointer', transition: 'all 0.2s',
            backdropFilter: 'blur(8px)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
        >
          <X size={28} />
        </button>
        <button 
          onClick={() => handleSwipe('right')}
          style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)', border: 'none',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            color: 'white', cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Heart size={28} fill="white" />
        </button>
      </div>

    </div>
  );
};

export default Match;
