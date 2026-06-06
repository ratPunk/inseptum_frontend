import React, { useState } from 'react';
import { TestFull } from '../../api/testsApi';
import TestResults from './TestResults';

interface TestRunnerProps {
  test: TestFull;
  onBack: () => void;
  onComplete: () => void;
}

const TestRunner: React.FC<TestRunnerProps> = ({ test, onBack, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = test.questions[currentIndex];
  const totalQuestions = test.questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const handleSelectAnswer = (answerId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <TestResults
        test={test}
        answers={answers}
        onRetry={handleRetry}
        onBack={() => { onComplete(); }}
      />
    );
  }

  const selectedAnswer = answers[currentQuestion.id] ?? null;

  return (
    <div className="test-runner">
      <div className="test-runner__header">
        <h2 className="test-runner__title">{test.title}</h2>
        <span className="test-runner__progress">
          Вопрос {currentIndex + 1} из {totalQuestions}
        </span>
        <div className="test-runner__progress-bar">
          <div
            className="test-runner__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="test-question">
        <p className="test-question__text">{currentQuestion.text}</p>
        <div className="test-question__answers">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`test-question__answer ${
                selectedAnswer === option.id
                  ? 'test-question__answer--selected'
                  : ''
              }`}
              onClick={() => handleSelectAnswer(option.id)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      <div className="test-runner__nav">
        <button
          type="button"
          className="test-runner__btn"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Назад
        </button>
        <button
          type="button"
          className="test-runner__btn"
          onClick={onBack}
        >
          К списку
        </button>
        <button
          type="button"
          className="test-runner__btn test-runner__btn--primary"
          onClick={handleNext}
          disabled={!selectedAnswer}
        >
          {currentIndex === totalQuestions - 1 ? 'Завершить' : 'Вперёд'}
        </button>
      </div>
    </div>
  );
};

export default TestRunner;
