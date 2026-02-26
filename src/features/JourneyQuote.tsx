import { useMemo } from 'react';

export const JourneyQuote = () => {
  const dailyQuote = useMemo(() => {
    const quotes = [
      "Your journey is written in the density of your presence.",
      "We suffer more often in imagination than in reality. — Seneca",
      "You have power over your mind, not outside events. — Marcus Aurelius",
      "The obstacle in the path becomes the path. — Marcus Aurelius",
      "First say to yourself what you would be; and then do what you have to do. — Epictetus",
      "No man is free who is not master of himself. — Epictetus",
      "Waste no more time arguing what a good man should be. Be one. — Marcus Aurelius",
      "It is not that we have a short time to live, but that we waste a lot of it. — Seneca",
      "What we do now echoes in eternity. — Marcus Aurelius",
      "Do not let the future disturb you. You will meet it, if you have to. — Marcus Aurelius",
      "Focus on what is up to you, ignore what is not. — Epictetus",
      "Step by step. Echo by echo."
    ];
    // Teilt die vergangenen Millisekunden in ganze Tage auf, um den Index zu bestimmen
    const dayIndex = Math.floor(Date.now() / 86400000);
    return quotes[dayIndex % quotes.length];
  }, []);

  return (
    <p className="text-center text-text-dim italic font-medium text-sm px-8 leading-relaxed opacity-80">
      "{dailyQuote}"
    </p>
  );
};