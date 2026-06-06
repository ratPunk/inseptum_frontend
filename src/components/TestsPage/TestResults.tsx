import React, { useEffect, useRef, useState } from 'react';
import { TestFull, TestAttemptResult, submitTest } from '../../api/testsApi';

interface TestResultsProps {
  test: TestFull;
  answers: Record<number, string>;
  onRetry: () => void;
  onBack: (passed: boolean) => void;
}

const TestResults: React.FC<TestResultsProps> = ({
  test,
  answers,
  onRetry,
  onBack,
}) => {
  const [result, setResult] = useState<TestAttemptResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitted = useRef(false);

  useEffect(() => {
    // Защита от двойного POST в StrictMode
    if (submitted.current) return;
    submitted.current = true;

    const payload = {
      answers: test.questions.map((q) => ({
        question_id: q.id,
        answer: answers[q.id] ?? '',
      })),
    };

    submitTest(test.id, payload)
      .then((data) => setResult(data))
      .catch((err) => {
        setSubmitError(
          err instanceof Error ? err.message : 'Не удалось сохранить результат',
        );
        // Считаем локально как запасной вариант
        const correct = test.questions.reduce(
          (n, q) => (answers[q.id] === q.correct_answer ? n + 1 : n),
          0,
        );
        setResult({
          attempt_id: 0,
          test_id: test.id,
          score: correct,
          max_score: test.questions.length,
          passed: correct / test.questions.length >= 0.6,
          correct_answers: correct,
          total_questions: test.questions.length,
          created_at: new Date().toISOString(),
        });
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!result) {
    return (
      <div className="test-results">
        <p style={{ textAlign: 'center', opacity: 0.7 }}>Сохраняем результат…</p>
      </div>
    );
  }

  const { correct_answers, total_questions, score, max_score, passed } = result;
  const percent = Math.round((correct_answers / total_questions) * 100);

  return (
    <div className="test-results">
      <div className="test-results__header">
        <h2 className="test-results__title">Результаты: {test.title}</h2>
        {submitError && (
          <p style={{ color: 'var(--exit-color)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            ⚠ {submitError} — показан локальный счёт
          </p>
        )}
      </div>

      <div className="test-results__score">
        <div>
          <div className="test-results__score-number">
            {correct_answers}/{total_questions}
          </div>
          <div className="test-results__score-label">правильных</div>
        </div>
        <div>
          <div className="test-results__score-percent">{percent}%</div>
          <div className="test-results__score-label">результат</div>
        </div>
        <div>
          <div
            className="test-results__score-percent"
            style={{ color: passed ? 'var(--accent-color)' : 'var(--exit-color)' }}
          >
            {passed ? 'Тест пройден' : 'Не пройден'}
          </div>
          <div className="test-results__score-label">
            {score}/{max_score} очков
          </div>
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
          onClick={() => onBack(passed)}
        >
          К списку тестов
        </button>
      </div>
    </div>
  );
};

export default TestResults;
