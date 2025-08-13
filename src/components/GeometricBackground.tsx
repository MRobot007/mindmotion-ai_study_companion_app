import React from 'react';

interface GeometricBackgroundProps {
  variant?: 'landing' | 'dashboard' | 'minimal';
  className?: string;
}

const GeometricBackground: React.FC<GeometricBackgroundProps> = ({ 
  variant = 'landing', 
  className = '' 
}) => {
  const renderLandingBackground = () => (
    <>
      {/* SUPER VISIBLE geometric pattern overlay */}
      <div className="geometric-pattern z-pattern"></div>
      
      {/* MASSIVE floating 3D geometric shapes */}
      <div className="absolute top-20 left-10 animate-float-3d z-shapes">
        <div className="geometric-cube animate-cube-rotate">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face right"></div>
          <div className="face left"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>
      </div>

      <div className="absolute top-40 right-20 animate-octahedron-twist z-shapes">
        <div className="geometric-octahedron"></div>
      </div>

      <div className="absolute bottom-32 left-1/4 animate-sphere-glow z-shapes">
        <div className="geometric-sphere animate-morph"></div>
      </div>

      <div className="absolute top-1/2 right-1/4 z-shapes">
        <div className="animate-orbit">
          <div className="geometric-diamond animate-diamond-sparkle"></div>
        </div>
      </div>

      <div className="absolute bottom-20 right-10 animate-hexagon-float z-shapes">
        <div className="geometric-hexagon"></div>
      </div>

      <div className="absolute top-60 left-1/3 animate-torus-rotate z-shapes">
        <div className="geometric-torus animate-geometric-pulse"></div>
      </div>

      <div className="absolute bottom-40 left-20 animate-pyramid-spin z-shapes">
        <div className="geometric-pyramid"></div>
      </div>

      {/* MORE scattered shapes for maximum visibility */}
      <div className="absolute top-32 right-1/3 animate-diamond-sparkle z-shapes">
        <div className="geometric-diamond" style={{ width: '70px', height: '70px' }}></div>
      </div>

      <div className="absolute bottom-60 left-1/2 animate-hexagon-float z-shapes">
        <div className="geometric-hexagon" style={{ width: '80px', height: '69.3px', margin: '34.65px 0' }}></div>
      </div>

      <div className="absolute top-3/4 right-16 animate-sphere-glow z-shapes">
        <div className="geometric-sphere" style={{ width: '80px', height: '80px' }}></div>
      </div>

      <div className="absolute top-16 left-1/2 animate-cube-rotate z-shapes">
        <div className="geometric-cube" style={{ width: '80px', height: '80px' }}>
          <div className="face front" style={{ width: '80px', height: '80px' }}></div>
          <div className="face back" style={{ width: '80px', height: '80px' }}></div>
          <div className="face right" style={{ width: '80px', height: '80px' }}></div>
          <div className="face left" style={{ width: '80px', height: '80px' }}></div>
          <div className="face top" style={{ width: '80px', height: '80px' }}></div>
          <div className="face bottom" style={{ width: '80px', height: '80px' }}></div>
        </div>
      </div>

      <div className="absolute bottom-16 right-1/3 animate-octahedron-twist z-shapes">
        <div className="geometric-octahedron" style={{ width: '70px', height: '70px' }}></div>
      </div>

      <div className="absolute top-1/4 right-10 animate-torus-rotate z-shapes">
        <div className="geometric-torus" style={{ width: '90px', height: '90px' }}></div>
      </div>

      {/* HUGE background geometric shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-20 z-background">
        <div className="w-full h-full bg-gradient-to-br from-amber-300 to-orange-300 rounded-full animate-morph"></div>
      </div>

      <div className="absolute bottom-0 left-0 w-80 h-80 opacity-20 z-background">
        <div className="w-full h-full bg-gradient-to-tr from-yellow-300 to-amber-300 transform rotate-45 animate-float-3d"></div>
      </div>

      <div className="absolute top-1/4 left-0 w-64 h-64 opacity-15 z-background">
        <div className="w-full h-full bg-gradient-to-br from-orange-300 to-amber-300 transform rotate-12 animate-geometric-pulse"></div>
      </div>

      <div className="absolute top-1/2 left-1/2 w-72 h-72 opacity-15 z-background transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-full h-full bg-gradient-to-br from-amber-200 to-yellow-200 rounded-full animate-morph"></div>
      </div>

      {/* Multiple orbiting elements */}
      <div className="absolute top-1/3 left-1/2 w-32 h-32 z-shapes">
        <div className="absolute inset-0 animate-orbit">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-90 animate-sphere-glow"></div>
        </div>
        <div className="absolute inset-0 animate-orbit delay-1000" style={{ animationDirection: 'reverse' }}>
          <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full opacity-80 animate-geometric-pulse"></div>
        </div>
      </div>

      <div className="absolute bottom-1/3 right-1/3 w-24 h-24 z-shapes">
        <div className="absolute inset-0 animate-orbit delay-500">
          <div className="w-7 h-7 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full opacity-85 animate-sphere-glow"></div>
        </div>
      </div>

      <div className="absolute top-1/6 right-1/6 w-28 h-28 z-shapes">
        <div className="absolute inset-0 animate-orbit delay-1500">
          <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full opacity-80 animate-geometric-pulse"></div>
        </div>
      </div>

      {/* MASSIVE floating particles */}
      <div className="absolute top-16 right-1/3 floating-particle floating-particle-1 animate-float-3d z-particles"></div>
      <div className="absolute bottom-24 left-1/3 floating-particle floating-particle-2 animate-float-3d delay-500 z-particles"></div>
      <div className="absolute top-2/3 right-16 floating-particle floating-particle-3 animate-float-3d delay-1000 z-particles"></div>
      <div className="absolute top-1/4 left-16 floating-particle floating-particle-1 animate-float-3d delay-1500 z-particles"></div>
      <div className="absolute bottom-1/3 right-1/4 floating-particle floating-particle-2 animate-float-3d delay-2000 z-particles"></div>
      <div className="absolute top-1/6 left-1/2 floating-particle floating-particle-3 animate-float-3d delay-300 z-particles"></div>
      <div className="absolute bottom-1/6 right-1/2 floating-particle floating-particle-1 animate-float-3d delay-800 z-particles"></div>
      <div className="absolute top-3/4 left-1/6 floating-particle floating-particle-2 animate-float-3d delay-1200 z-particles"></div>
      <div className="absolute top-1/8 right-1/8 floating-particle floating-particle-3 animate-float-3d delay-600 z-particles"></div>
      <div className="absolute bottom-1/8 left-1/8 floating-particle floating-particle-1 animate-float-3d delay-900 z-particles"></div>
    </>
  );

  const renderDashboardBackground = () => (
    <>
      {/* Visible geometric pattern */}
      <div className="geometric-pattern opacity-30 z-pattern"></div>
      
      {/* LARGE visible floating shapes */}
      <div className="absolute top-10 right-10 animate-float-3d z-shapes">
        <div className="geometric-sphere animate-sphere-glow" style={{ width: '80px', height: '80px' }}></div>
      </div>

      <div className="absolute bottom-20 left-10 animate-diamond-sparkle z-shapes">
        <div className="geometric-diamond" style={{ width: '70px', height: '70px' }}></div>
      </div>

      <div className="absolute top-1/2 right-20 animate-hexagon-float z-shapes">
        <div className="geometric-hexagon" style={{ width: '90px', height: '78px', margin: '39px 0' }}></div>
      </div>

      <div className="absolute top-1/4 left-1/4 animate-torus-rotate z-shapes">
        <div className="geometric-torus" style={{ width: '85px', height: '85px' }}></div>
      </div>

      <div className="absolute bottom-1/3 right-1/3 animate-octahedron-twist z-shapes">
        <div className="geometric-octahedron" style={{ width: '75px', height: '75px' }}></div>
      </div>

      <div className="absolute top-20 left-1/3 animate-cube-rotate z-shapes">
        <div className="geometric-cube" style={{ width: '80px', height: '80px' }}>
          <div className="face front" style={{ width: '80px', height: '80px' }}></div>
          <div className="face back" style={{ width: '80px', height: '80px' }}></div>
          <div className="face right" style={{ width: '80px', height: '80px' }}></div>
          <div className="face left" style={{ width: '80px', height: '80px' }}></div>
          <div className="face top" style={{ width: '80px', height: '80px' }}></div>
          <div className="face bottom" style={{ width: '80px', height: '80px' }}></div>
        </div>
      </div>

      <div className="absolute bottom-32 right-1/4 animate-pyramid-spin z-shapes">
        <div className="geometric-pyramid" style={{ 
          borderLeft: '40px solid transparent',
          borderRight: '40px solid transparent',
          borderBottom: '70px solid rgba(251, 191, 36, 1)'
        }}></div>
      </div>

      <div className="absolute top-1/3 right-1/6 animate-sphere-glow z-shapes">
        <div className="geometric-sphere" style={{ width: '60px', height: '60px' }}></div>
      </div>

      <div className="absolute bottom-1/6 left-1/2 animate-diamond-sparkle z-shapes">
        <div className="geometric-diamond" style={{ width: '55px', height: '55px' }}></div>
      </div>

      {/* Large visible background shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-15 z-background">
        <div className="w-full h-full bg-gradient-to-br from-amber-200 to-orange-200 rounded-full animate-morph"></div>
      </div>

      <div className="absolute bottom-0 left-0 w-48 h-48 opacity-15 z-background">
        <div className="w-full h-full bg-gradient-to-tr from-yellow-200 to-amber-200 transform rotate-45 animate-geometric-pulse"></div>
      </div>

      <div className="absolute top-1/2 left-1/2 w-56 h-56 opacity-10 z-background transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full animate-morph"></div>
      </div>

      {/* Orbiting elements */}
      <div className="absolute top-1/3 left-1/2 w-24 h-24 z-shapes">
        <div className="absolute inset-0 animate-orbit">
          <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-85 animate-sphere-glow"></div>
        </div>
      </div>

      <div className="absolute bottom-1/4 right-1/5 w-20 h-20 z-shapes">
        <div className="absolute inset-0 animate-orbit delay-1000">
          <div className="w-5 h-5 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full opacity-80 animate-geometric-pulse"></div>
        </div>
      </div>

      {/* Enhanced floating particles */}
      <div className="absolute top-20 left-1/3 floating-particle floating-particle-1 animate-float-3d z-particles"></div>
      <div className="absolute bottom-32 right-1/4 floating-particle floating-particle-2 animate-float-3d delay-1000 z-particles"></div>
      <div className="absolute top-2/3 left-20 floating-particle floating-particle-3 animate-float-3d delay-500 z-particles"></div>
      <div className="absolute top-1/6 right-1/3 floating-particle floating-particle-1 animate-float-3d delay-1500 z-particles"></div>
      <div className="absolute bottom-1/6 left-1/2 floating-particle floating-particle-2 animate-float-3d delay-800 z-particles"></div>
      <div className="absolute top-3/4 right-1/6 floating-particle floating-particle-3 animate-float-3d delay-1200 z-particles"></div>
    </>
  );

  const renderMinimalBackground = () => (
    <>
      {/* Visible pattern */}
      <div className="geometric-pattern opacity-20 z-pattern"></div>
      
      {/* Visible floating elements */}
      <div className="absolute top-20 right-20 animate-float-3d z-shapes">
        <div className="geometric-sphere animate-sphere-glow opacity-80" style={{ width: '60px', height: '60px' }}></div>
      </div>

      <div className="absolute bottom-20 left-20 animate-diamond-sparkle z-shapes">
        <div className="geometric-diamond opacity-75" style={{ width: '50px', height: '50px' }}></div>
      </div>

      <div className="absolute top-1/2 right-1/3 animate-hexagon-float z-shapes">
        <div className="geometric-hexagon opacity-70" style={{ width: '65px', height: '56.3px', margin: '28.15px 0' }}></div>
      </div>

      <div className="absolute bottom-1/3 left-1/3 animate-torus-rotate z-shapes">
        <div className="geometric-torus opacity-75" style={{ width: '70px', height: '70px' }}></div>
      </div>

      <div className="absolute top-1/4 left-1/6 animate-octahedron-twist z-shapes">
        <div className="geometric-octahedron opacity-70" style={{ width: '55px', height: '55px' }}></div>
      </div>

      <div className="absolute bottom-1/6 right-1/6 animate-cube-rotate z-shapes">
        <div className="geometric-cube opacity-75" style={{ width: '60px', height: '60px' }}>
          <div className="face front" style={{ width: '60px', height: '60px' }}></div>
          <div className="face back" style={{ width: '60px', height: '60px' }}></div>
          <div className="face right" style={{ width: '60px', height: '60px' }}></div>
          <div className="face left" style={{ width: '60px', height: '60px' }}></div>
          <div className="face top" style={{ width: '60px', height: '60px' }}></div>
          <div className="face bottom" style={{ width: '60px', height: '60px' }}></div>
        </div>
      </div>

      {/* Visible background shapes */}
      <div className="absolute top-1/2 left-1/2 w-40 h-40 opacity-15 z-background transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 rounded-full animate-morph"></div>
      </div>

      <div className="absolute top-1/4 right-1/4 w-32 h-32 opacity-10 z-background">
        <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-amber-100 transform rotate-45 animate-geometric-pulse"></div>
      </div>

      <div className="absolute bottom-1/4 left-1/4 w-36 h-36 opacity-12 z-background">
        <div className="w-full h-full bg-gradient-to-br from-amber-200 to-yellow-200 rounded-full animate-morph"></div>
      </div>

      {/* Orbiting element */}
      <div className="absolute top-1/3 left-2/3 w-16 h-16 z-shapes">
        <div className="absolute inset-0 animate-orbit">
          <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-80 animate-sphere-glow"></div>
        </div>
      </div>

      {/* Visible floating particles */}
      <div className="absolute top-1/4 right-1/4 floating-particle floating-particle-1 animate-float-3d opacity-80 z-particles"></div>
      <div className="absolute bottom-1/4 left-1/4 floating-particle floating-particle-2 animate-float-3d delay-1000 opacity-70 z-particles"></div>
      <div className="absolute top-3/4 left-3/4 floating-particle floating-particle-3 animate-float-3d delay-500 opacity-60 z-particles"></div>
      <div className="absolute top-1/6 left-1/2 floating-particle floating-particle-1 animate-float-3d delay-1500 opacity-75 z-particles"></div>
      <div className="absolute bottom-1/6 right-1/2 floating-particle floating-particle-2 animate-float-3d delay-800 opacity-65 z-particles"></div>
    </>
  );

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none bg-3d-geometric ${className}`} style={{ zIndex: 0 }}>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-beige-50 to-amber-50 z-background"></div>
      
      {/* Enhanced radial gradient overlays */}
      <div className="absolute inset-0 z-pattern">
        <div className="absolute inset-0 bg-gradient-radial from-amber-100/30 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-orange-100/25 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-yellow-100/25 via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 w-1/3 h-1/3 bg-gradient-radial from-amber-200/20 via-transparent to-transparent transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Render variant-specific content */}
      {variant === 'landing' && renderLandingBackground()}
      {variant === 'dashboard' && renderDashboardBackground()}
      {variant === 'minimal' && renderMinimalBackground()}
    </div>
  );
};

export default GeometricBackground;