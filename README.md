# MeCrafter App

**Welcome to MeCrafter**, a habit-tracking app with social media features, designed to help you cultivate positive habits with self-love and compassion. This README provides information on how to use the app, deploy it, and details about its functionalities.

## Screenshots
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/cd61e873-25f7-479f-b3d0-4fdf17183444" alt="Welcome screen" width="300" />
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/0cd5c019-a3bc-4049-8d07-d91ba32801ec" alt="Creating post" width="300" />
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/0fa9b552-e9bd-4eed-b16a-47a15c528c52" alt="Edit post" width="300" />
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/655ae3ff-e64c-45d7-ace2-cdb9bebc1346" alt="Feed" width="300" />
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/e918208a-0000-4909-a506-6b91387b8f35" alt="Feed when not signed in" width="300" /> 
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/8aa75503-cee3-40fa-9110-a43f68a97bac" alt="Comment" width="300" /> 
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/642d1af7-f6cd-4063-8c12-b34c0eebb568" alt="Comments" width="300" /> 
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/8e851547-286c-4d02-b0fe-a292d292a9f9" alt="Post a comment" width="300" />
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/ba103854-8525-4ff1-9230-4a0d2595bbee" alt="Like" width="300" />
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/f6cc1607-5bc9-4bef-8505-856a61973d73" alt="Comment editing" width="300" /> 
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/d705200f-ba0b-457c-9e43-7b5e10bfc367" alt="Explore habits" width="300" />
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/05fe92fc-6ff5-4571-9609-d73a66d13101" alt="Search a habit by name" width="300" />
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/09db1070-b8fb-4bde-857d-e5cb4bf2a5f9" alt="Filter habits by a category" width="300" /> 
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/fb098f9a-2adc-4501-8bcf-aee6cfef7daa" alt="Habit tracker with a calendar" width="300" />
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/5762498f-9de3-40d0-9ab8-13ef8349844f" alt="Mark habit completed" width="300" /> 
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/8126c05d-cd89-4ca4-82e4-5c35c3157aec" alt="Reflections and diary" width="300" /> 
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/fcedd56b-338b-4856-8538-3190a9cd6934" alt="Adding a reflection" width="300" /> 
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/3c0a0d72-fde2-41bf-9fa9-0d1c53b01433" alt="User profile" width="300" /> 
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/29332561-ef39-4e94-9bfa-4a3c92dad4cc" alt="Edit profile" width="300" />
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/a4e8b28d-4398-458b-a53e-34a7ea5956f4" alt="Changing habit" width="300" /> 
<img src="https://github.com/iaroslavagoncharova/mecrafter-rn-app/assets/111697910/9faec875-1126-402d-ba84-073a76de93c5" alt="Change a habit frequency" width="300" />

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
   - Authentication server is available at [auth-api](http://10.120.32.96/auth-api/api/v1)
   - Media server is available at [media-api](http://10.120.32.96/media-api/api/v1)
   - Upload server is available at [upload](http://10.120.32.96/upload/api/v1)

## Backend

## API Documentation

[Auth-api](https://users.metropolia.fi/~iaroslag/apidoc/auth-api/)
[Media-api](https://users.metropolia.fi/~iaroslag/apidoc/media-api/)

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
- **Comments**: Comment on others' posts, edit and delete comments.
- **Likes**: Like others' posts.
- **Edit and delete posts**: Edit or remove your own posts.
- **Habits**: Explore a list of habits, filter them by category, or search by name. Add a habit to your profile to start tracking.
- **Habit Frequency**: Set a habit frequency in your profile and receive notifications once you achieve it.
- **Habit Tracking**: Keep track of your habits by marking them as completed each day. Receive motivational messages to stay on track and reach your goals. See your completed dates in the calendar. 
- **Reflections**: Reflect on your day and habits using prompts provided by the app.
- **Profile**: Create a profile where you can choose a habit and set its frequency.
- **Edit and Delete profile**: Modify your profile information or delete your profile entirely if needed.
- **Auto login**: Automatically log in to your account upon opening the app, providing a seamless user experience.

## Known Issues
- User likes are not always shown correctly on initial load

## References

**Libraries**: @ui-kitten, @react-native-async-storage, @react-native-picker, @react-navigation, @eva-design, expo, expo-av, expo-image-picker, expo-status-bar, react-hook-form, react-native-calendars, react-native-picker-select
