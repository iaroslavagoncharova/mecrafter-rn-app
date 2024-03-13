CREATE TABLE Users (
    user_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    habit_id INT(11),
    habit_frequency INT(11),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP()
);

CREATE TABLE Habits (
    habit_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    habit_name VARCHAR(255) NOT NULL,
    habit_description TEXT,
    habit_category VARCHAR(255),
    is_default TINYINT(1),
    user_id INT(11),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Achieved (
    user_id INT(11) NOT NULL,
    habit_id INT(11) NOT NULL,
    PRIMARY KEY (user_id, habit_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (habit_id) REFERENCES Habits(habit_id)
);

CREATE TABLE Messages (
    message_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    message_text VARCHAR(255) NOT NULL,
    message_author VARCHAR(255),
    last_used_date DATE
);

CREATE TABLE ReflectionPrompts (
    prompt_id INT(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
    prompt_text VARCHAR(255),
    type VARCHAR(255)
);

CREATE TABLE UserReflections (
    reflection_id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user_id INT(11) NOT NULL,
    prompt_id INT(11),
    reflection_text VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (prompt_id) REFERENCES ReflectionPrompts(prompt_id)
);

CREATE TABLE Posts (
    post_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) NOT NULL,
    post_text VARCHAR(255) NOT NULL,
    post_title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    filename VARCHAR(255) NOT NULL,
    filesize INT(11) NOT NULL,
    media_type VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Comments (
    comment_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    post_id INT(11) NOT NULL,
    user_id INT(11) NOT NULL,
    comment_text VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Likes (
    like_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    post_id INT(11) NOT NULL,
    user_id INT(11) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

INSERT INTO Habits (habit_name, habit_description, habit_category, is_default, user_id)
VALUES
('Drink water', 'Drink 8 glasses of water a day', 'Health', 1, NULL),
('Read', 'Read for 30 minutes', 'Personal', 1, NULL),
('Exercise', 'Exercise for 30 minutes', 'Health', 1, NULL),
('Meditate', 'Meditate for 10 minutes', 'Self-care', 1, NULL),
('Plan', 'Plan your day', 'Productivity', 1, NULL),
('Sleep', 'Get 8 hours of sleep', 'Self-care', 1, NULL),
('Cook', 'Cook a healthy meal', 'Health', 1, NULL),
('Journal', 'Write in your journal', 'Personal', 1, NULL),
('Budget', 'Budget your expenses', 'Finance', 1, NULL),
('Connect', 'Connect with a friend', 'Relationships', 1, NULL),
('Stretch', 'Stretch for 10 minutes', 'Health', 1, NULL),
('Learn', 'Learn something new every day', 'Personal', 1, NULL),
('Yoga', 'Practice yoga for 20 minutes', 'Self-care', 1, NULL),
('Write', 'Write a paragraph or more', 'Personal', 1, NULL),
('Eat veggies', 'Include vegetables in every meal', 'Health', 1, NULL),
('Walk', 'Take a 30-minute walk', 'Health', 1, NULL),
('Reflect', 'Reflect on your day for 10 minutes', 'Self-care', 1, NULL),
('Plan meals', 'Plan your meals for the week', 'Health', 1, NULL),
('Learn instrument', 'Practice playing a musical instrument', 'Personal', 1, NULL),
('Digital detox', 'Take a break from screens for an hour', 'Self-care', 1, NULL),
('Plan your tasks for the day', 'Organize and plan your daily tasks', 'Productivity', 1, NULL),
('Prioritize your to-do list', 'Identify and prioritize important tasks', 'Productivity', 1, NULL),
('Set specific goals for the week', 'Define clear goals for the upcoming week', 'Productivity', 1, NULL),
('Break down big tasks into smaller steps', 'Divide large tasks into manageable steps', 'Productivity', 1, NULL),
('Use a productivity technique (e.g., Pomodoro)', 'Incorporate a productivity method into your routine', 'Productivity', 1, NULL),
('Send a thoughtful message to a loved one', 'Express your feelings and appreciation to someone special', 'Relationships', 1, NULL),
('Plan a surprise for your significant other', 'Create a delightful surprise for your partner', 'Relationships', 1, NULL),
('Schedule quality time with family', 'Plan and dedicate time for meaningful moments with family', 'Relationships', 1, NULL),
('Express gratitude to someone in your life', 'Show appreciation to a friend or family member', 'Relationships', 1, NULL),
('Practice active listening in conversations', 'Engage in focused and attentive listening during conversations', 'Relationships', 1, NULL),
('Track your daily expenses', 'Monitor and record your daily expenditures', 'Finance', 1, NULL),
('Create a monthly budget', 'Develop a monthly financial plan for expenses and savings', 'Finance', 1, NULL),
('Save a percentage of your income', 'Allocate a portion of your income for savings', 'Finance', 1, NULL),
('Research investment options', 'Explore and educate yourself on potential investment opportunities', 'Finance', 1, NULL),
('Educate yourself on personal finance', 'Learn about personal finance principles and strategies', 'Finance', 1, NULL);

INSERT INTO Messages (message_text, message_author) VALUES
('Your habits determine your future. Choose them wisely.', NULL),
('Success is the sum of small efforts, repeated day in and day out.', 'Robert Collier'),
('Motivation is what gets you started. Habit is what keeps you going.', 'Jim Rohn'),
('Excellence is an art won by training and habituation. We do not act rightly because we have virtue or excellence, but rather, we have those because we have acted rightly. We are what we repeatedly do. Excellence, then, is not an act but a habit.', 'Aristotle'),
('The secret of your future is hidden in your daily routine.', 'Mike Murdock'),
('It''s not that we have a short time to live, but that we waste much of it.', 'Seneca'),
('Successful people are simply those with successful habits.', 'Brian Tracy'),
('We are what we repeatedly do. Excellence, then, is not an act, but a habit.', 'Will Durant'),
('Make each day your masterpiece.', 'John Wooden'),
('The only way to do great work is to love what you do. If you haven''t found it yet, keep looking. Don''t settle.', 'Steve Jobs'),
('You will never change your life until you change something you do daily. The secret of your success is found in your daily routine.', 'John C. Maxwell'),
('The more I want to get something done, the less I call it work.', 'Richard Bach'),
('Good habits are worth being fanatical about.', 'John Irving'),
('It''s easier to prevent bad habits than to break them.', 'Benjamin Franklin'),
('Your net worth to the world is usually determined by what remains after your bad habits are subtracted from your good ones.', 'Benjamin Franklin'),
('We first make our habits, and then our habits make us.', 'John Dryden'),
('The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will.', 'Vince Lombardi'),
('The only limit to our realization of tomorrow will be our doubts of today.', 'Franklin D. Roosevelt'),
('You don''t have to be great to start, but you have to start to be great.', 'Zig Ziglar'),
('Motivation gets you going, but discipline keeps you growing.', 'John C. Maxwell');

INSERT INTO ReflectionPrompts (prompt_text, type) VALUES
(' What small victories did you achieve this week, and how did they make you feel?', 'success'),
('Describe a moment when you felt proud of yourself for sticking to a habit. How can you replicate that feeling?', 'success'),
('Share a positive impact that one of your habits had on your overall well-being or mood.', 'success')

