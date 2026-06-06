import React from 'react';
import { TestFull } from '../../api/testsApi';

interface TestResultsProps {
  test: TestFull;
  answers: Record<number, string>;
  onRetry: () => void;
  onBack: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({
  test,
  answers,
  onRetry,
  onBack,
}) => {
  const correctCount = test.questions.reduce((count, question) => {
    return answers[question.id] === question.correct_answer ? count + 1 : count;
  }, 0);

  const totalQuestions = test.questions.length;
  const percent = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="test-results">
      <div className="test-results__header">
        <h2 className="test-results__title">Результаты: {test.title}</h2>
      </div>

      <div className="test-results__score">
        <div>
          <div className="test-results__score-number">
            {correctCount}/{totalQuestions}
          </div>
          <div className="test-results__score-label">правильных</div>
        </div>
        <div>
          <div className="test-results__score-percent">{percent}%</div>
          <div className="test-results__score-label">результат</div>
        </div>
      </div>

      <div className="test-results__list">
        {test.questions.map((question, index) => {
          const isCorrect = answers[question.id] === question.correct_answer;
          return (
            <div key={question.id} className="test-results__item">
              <div
                className={`test-results__item-icon ${
                  isCorrect
                    ? 'test-results__item-icon--correct'
                    : 'test-results__item-icon--wrong'
                }`}
              >
                {isCorrect ? '✓' : '✗'}
              </div>
              <span className="test-results__item-text">
                {index + 1}. {question.text}
              </span>
            </div>
          );
        })}
      </div>

      <div className="test-results__actions">
        <button
          type="button"
          className="test-runner__btn"
          onClick={onRetry}
        >
          Пройти заново
        </button>
        <button
          type="button"
          className="test-runner__btn test-runner__btn--primary"
          onClick={onBack}
        >
          К списку тестов
        </button>
      </div>
    </div>
  );
};

export default TestResults;
