INSERT INTO quizzes (title, subject, duration_minutes) VALUES
  ('JAMB Mathematics Foundation', 'Mathematics', 10),
  ('WAEC English Comprehension', 'English', 10);

INSERT INTO questions (quiz_id, question_text, options, correct_option) VALUES
  (1, 'Solve: 3x + 5 = 20', '["x = 3", "x = 5", "x = 4", "x = 6"]', 'x = 5'),
  (1, 'What is 25% of 120?', '["30", "25", "20", "15"]', '30'),
  (1, 'Simplify 2a + 3a - 4a', '["a", "2a", "3a", "4a"]', 'a'),
  (1, 'If a triangle has angles 90°, 45°, and 45°, what type of triangle is it?', '["Equilateral", "Isosceles right", "Scalene", "Right-angled"]', 'Isosceles right'),
  (1, 'What is the value of 7²?', '["14", "49", "56", "63"]', '49'),

  (2, 'Choose the correct synonym for "abundant".', '["Scarce", "Plentiful", "Tiny", "Weak"]', 'Plentiful'),
  (2, 'The opposite of "ancient" is:', '["Old", "Modern", "Historic", "Mythic"]', 'Modern'),
  (2, 'Which sentence is grammatically correct?', '["She go to school yesterday.", "She went to school yesterday.", "She going to school yesterday.", "She gone to school yesterday."]', 'She went to school yesterday.'),
  (2, 'What is the main idea of a passage?', '["The final word", "The central message", "The list of names", "The title only"]', 'The central message'),
  (2, 'Which word is a noun?', '["Quickly", "Bravery", "Beautifully", "Run"]', 'Bravery');
