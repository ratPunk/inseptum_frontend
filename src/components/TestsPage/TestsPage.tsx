import React, { useState, useEffect } from 'react';
import { fetchTests, fetchTestContent, fetchMyResults, TestMeta, TestFull } from '../../api/testsApi';
import testImage from '../../style/images/test.webp';
import TestRunner from './TestRunner';
import './TestsPage.css';

const difficultyLabel: Record<string, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
};

const TestsPage: React.FC = () => {
  const [tests, setTests] = useState<TestMeta[]>([]);
  const [activeTest, setActiveTest] = useState<TestFull | null>(null);
  const [passedTests, setPassedTests] = useState<Set<number>>(new Set());

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Загружаем список тестов и уже пройденные результаты параллельно
    Promise.all([fetchTests(), fetchMyResults()])
      .then(([data, results]) => {
        setTests(data);
        const passedIds = new Set(
          results.filter((r) => r.passed).map((r) => r.test_id),
        );
        setPassedTests(passedIds);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить тесты');
        setIsLoading(false);
      });
  }, []);

  const handleSelectTest = async (id: number) => {
    try {
      setIsLoading(true);
      const fullTest = await fetchTestContent(id);
      setActiveTest(fullTest);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка при загрузке вопросов теста');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestComplete = (testId: number, passed: boolean) => {
    if (passed) {
      setPassedTests((prev) => new Set(prev).add(testId));
    }
    setActiveTest(null);
  };

  if (isLoading && tests.length === 0) {
    return <div className="tests-page__loading">Загрузка тестов...</div>;
  }

  if (error) {
    return <div className="tests-page__error">Ошибка: {error}</div>;
  }

  if (activeTest) {
    return (
      <TestRunner
        test={activeTest}
        onBack={() => setActiveTest(null)}
        onComplete={(passed) => handleTestComplete(activeTest.id, passed)}
      />
    );
  }

  return (
    <div className="tests-page">
      <div className="tests-page__header">
        <h1 className="tests-page__title">Тесты</h1>
        <p className="tests-page__subtitle">
          Проверьте свои знания по различным темам веб-разработки
        </p>
      </div>

      {tests.length === 0 ? (
        <p className="tests-page__empty">Доступных тестов пока нет.</p>
      ) : (
        <div className="tests-page__grid">
          {tests.map((test) => (
            <button
              key={test.id}
              className="test-card"
              onClick={() => handleSelectTest(test.id)}
              type="button"
            >
              <div className="test-card__image-wrapper">
                <img className="test-card__image" src={testImage} alt="" aria-hidden="true" />
              </div>
              <h3 className="test-card__title">{test.title}</h3>
              <p className="test-card__description">{test.description}</p>
              <div className="test-card__meta">
                {test.difficulty && (
                  <span className="test-card__difficulty">
                    {difficultyLabel[test.difficulty] ?? test.difficulty}
                  </span>
                )}
                {test.time_limit && (
                  <span className="test-card__time">
                    {Math.round(test.time_limit / 60)} мин
                  </span>
                )}
                <span
                  className={`test-card__badge ${
                    passedTests.has(test.id)
                      ? 'test-card__badge--passed'
                      : 'test-card__badge--not-passed'
                  }`}
                >
                  {passedTests.has(test.id) ? 'Пройден' : 'Не пройден'}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestsPage;
