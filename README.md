# MeCrafter App

**Welcome to MeCrafter**, a habit-tracking app with social media features, designed to help you cultivate positive habits with self-love and compassion. This README provides information on how to use the app, deploy it, and details about its functionalities.

## Deployment

To deploy the MeCrafter app, follow these steps:

1. **Frontend Deployment**:
   - If using React Native, ensure Expo Go is installed on your device.
   - Clone the repository.
   - Navigate to the project directory and run `npm install` to install dependencies.
   - Ensure both your device and computer are connected to Metropolia VPN.
   - Start the development server with `expo start` or `npm start`.
   - Scan the QR code with Expo Go to view the app on your device.

2. **Backend Deployment**:
   - Ensure your computer is connected to Metropolia VPN.
   - Authentication server is available at: [auth-api](http://10.120.32.96/auth-api/api/v1)
   - Media server is available at: [http://10.120.32.96/media-api/api/v1]
   - Upload server is available at: [http://10.120.32.96/upload/api/v1]

## Backend

## API Documentation

[Link to API Documentation](...)

## Database Description

The app's database consists of 9 tables:

- **Users**: This table contains users' data, including their username, user ID, password, email, habit ID, habit frequency, and creation date. The habit_id field references the habit_id from the Habits table.
- **Habits**: This table includes habit ID, habit name, habit description, habit category, and whether the default user or a specific user created the habit. The user_id field references the user_id from the Users table.
- **Posts**: Posts data, such as post ID, user ID (the owner), text, title, creation date, filename (used for retrieving images from the upload server), filesize, and media_type are stored in this table. The user_id field references the user_id from the Users table.
- **Comments**: Comments data includes comment ID, post ID, user ID, text, and creation date. The post_id field references the post_id from the Posts table, and the user_id field references the user_id from the Users table.
- **Likes**: This table contains users' likes, including like ID, post ID, user ID, and creation date. The post_id field references the post_id from the Posts table, and the user_id field references the user_id from the Users table.
- **ReflectionPrompts**: It stores reflection prompts, comprising prompt ID, text, and type (success, fail, etc.).
- **UserReflections**: Users' reflections on their day and habits are stored here. It includes reflection ID, user ID, prompt ID, text, and creation date. The user_id field references the user_id from the Users table, and the prompt_id references the prompt_id from the ReflectionPrompts table.
- **Messages**: Motivational messages data, including message ID, text, author (if it is a quote), and last used date to avoid repetition are stored here.
- **Achieved**: CURRENTLY UNUSED This table lists achieved habits. It includes user ID and habit ID fields. The user_id field references the user_id from the Users table, and the habit_id references the habit_id from the Habits table.

## Functionalities

- **Feed Posts**: Share text and images to the feed for others to see.
- **Comments**: Comment on others' posts.
- **Likes**: Like others' posts
- **Edit and delete posts**: Edit or remove your own posts.
- **Habits**: Explore a list of habits, filter them by category, or search by name. Add a habit to your profile to start tracking.
- **Habit Frequency**: Set a habit frequency in your profile and receive notifications once you achieve it.
- **Habit Tracking**: Keep track of your habits by marking them as completed each day. Receive motivational messages to stay on track and reach your goals.
- **Reflections**: Reflect on your day and habits using prompts provided by the app.
- **Profile**: Create a profile where you can choose a habit and set its frequency.
- **Edit and Delete profile**: Modify your profile information or delete your profile entirely if needed.
- **Auto login**: Automatically log in to your account upon opening the authentication page, providing a seamless user experience.

## Known Issues

## References

**Libraries**: @ui-kitten, @react-native-async-storage, @react-native-picker, @react-navigation, @eva-design, expo, expo-av, expo-image-picker, expo-status-bar, react-hook-form, react-native-calendars, react-native-picker-select
