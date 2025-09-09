import { useEffect, useState } from "react";
import { Zap, Brain, Sparkles } from "lucide-react";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Brain, text: "Inicializando IA..." },
    { icon: Zap, text: "Conectando servicios..." },
    { icon: Sparkles, text: "Preparando experiencia..." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        if (newProgress >= 33 && currentStep === 0) setCurrentStep(1);
        if (newProgress >= 66 && currentStep === 1) setCurrentStep(2);
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete, currentStep]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-accent/10 animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-primary-glow/10 animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="text-center z-10 animate-fade-in-up">
        <div className="mb-8 relative">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary p-4 shadow-glow animate-pulse-glow">
            <CurrentIcon className="w-full h-full text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gradient mb-2">AI Platform</h1>
        <p className="text-muted-foreground mb-8">Soluciones Inteligentes</p>

        <p className="text-lg text-foreground mb-6 min-h-[28px] animate-fade-in-up">
          {steps[currentStep].text}
        </p>

        <div className="w-64 mx-auto">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">{Math.round(progress)}%</p>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;