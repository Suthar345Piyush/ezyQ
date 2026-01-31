# EzyQ - Queue Management Made Easy 

A mobile first Queue Management Application , built for both User's and Business's , through which they can manage their queue efficiently and business's can track their user's position in queue and user's can track their own position in queue as well.

Initially at entry of the app , their are two choices go as user or go as business.


## Features (USER)

- **Search Queues** : User can search for queue to it's nearby
- **Scan QR** : User can scan an QR to join any queue
- **Explore Queues** : Can explore all the queue nearby with all metrices(distance , current queue size , etc.)
- **Queue Status** : User can check current status(active , paused , cancelled) of queue
- **Queue History** : Can check previous joined queue data and all other metrics related to this
- **Live Notifications** : User get's live notifications of his position in queue (underdevelopment)
- **Personal Profile** : User can check his profile and set some specific feature according to his choice


## Features (BUSINESS)

- **Dashboard** : A complete dashboard for business's with all essential metrics
- **Create & Manage Queues** : Business's can create and manage queues 
- **Queues History** : Business's can check queues that they've created and can maintain multiple queues at the same time 
- **Analytics** : Queue analytics where customers served in a day , weekly status and all things related to it
- **Settings** : Settings section where , business's can set settings according to their requirements


## Tech Stack

- **Framework**: React , React Native , Expo 54
- **Language**: TypeScript (strict mode)
- **Navigation** : React Navigation
- **Database**: SQLite (Expo-SQlite Plugin)
- **Styling**: Tamag UI - For fast rendering on low end devices as well
- **State**: Zustand
- **TS-Validation**:  Zod
- **Icons**: Expo-Ionicons


## Project Structure

```
ezy0/
├── src/
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── BusinessNavigator.tsx
│   │   └── UserNavigator.tsx
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── OTPVerificationScreen.tsx       #dev only for now
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── RoleSelectionScreen.tsx
│   │   │   └── WelcomeScreen.tsx
│   │   │
│   │   ├── business/
│   │   │   ├── AnalyticsScreen.tsx
│   │   │   ├── CreateQueueScreen.tsx
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── QueueDetailsScreen.tsx
│   │   │   ├── QueuesScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   │
│   │   └── user/
│   │       ├── EditProfileScreen.tsx
│   │       ├── ExploreScreen.tsx
│   │       ├── FindNearbyScreen.tsx
│   │       ├── HelpSupportScreen.tsx
│   │       ├── HistoryScreen.tsx
│   │       ├── HomeScreen.tsx
│   │       ├── JoinQueueScreen.tsx
│   │       ├── ProfileScreen.tsx
│   │       ├── QueueDetailsScreen.tsx
│   │       ├── ScanQRScreen.tsx
│   │       └── SettingsScreen.tsx
│   │
│   ├── services/
│   │   ├── auth/
│   │   │   └── googleAuth.service.ts
│   │   │
│   │   ├── database/
│   │   │   ├── repositories/
│   │   │   │   ├── QueueEntryRepository.ts
│   │   │   │   ├── QueueRepository.ts
│   │   │   │   └── UserRepository.ts
│   │   │   └── database.service.ts
│   │   │
│   │   ├── email/
│   │   │   └── resend.service.ts
│   │   │
│   │   └── stores/
│   │       ├── authService.ts
│   │       └── authStore.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   └── navigation.types.ts
│   │
│   ├── utils/
│   │   ├── index.ts
│   │   └── seedDatabase.ts
│   │
│   ├── .env
│   ├── .gitignore
│   ├── app.config.js
│   └── App.tsx
│
├── PROGRESS.md
└── README.md

```


## Future Features (Roadmap)

- [ ] Implement OAuth 2.0
- [ ] OTP Verification System (Resend)
- [ ] Live queue position notifications
- [ ] Redefine whole app UI
- [ ] Queue Search from Map functionality
- [ ] Feedback by User for particular queue
- [ ] Payment integration for Business's
- [ ] Soon publish on PlayStore

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
---


**Made with ❤️ by Piyush Suthar**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Suthar345Piyush)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/piyush-suthar-641a0826a/)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/eigenpiyush)

</div>
