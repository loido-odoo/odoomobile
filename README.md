# CRM Notification System

A web-based notification system that integrates with Dynamics CRM 365 and tracks notification interactions. This application allows users to receive real-time notifications from their CRM system and provides analytics on notification delivery and engagement.

## Features

- 🔔 Real-time notifications from Dynamics CRM 365
- 📊 Analytics dashboard for tracking notification engagement
- 🔐 Secure web push notifications
- 📱 Responsive design for mobile and desktop
- 📈 Interactive charts for visualization

## Prerequisites

- Node.js 20.x or later
- NPM 8.x or later

## Installation

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd crm-notification-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_VAPID_PUBLIC_KEY=your_vapid_public_key
   VAPID_PRIVATE_KEY=your_vapid_private_key
   ```

   You can generate VAPID keys using the web-push library:
   ```bash
   ./node_modules/.bin/web-push generate-vapid-keys
   ```

## Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Building for Production

```bash
npm run build
npm start
```

## API Endpoints

- `POST /api/webhook` - Receives notifications from CRM
- `POST /api/subscriptions` - Registers a new push notification subscription
- `GET /api/notifications` - Retrieves notification analytics
- `POST /api/notifications/:id/click` - Tracks notification clicks

## Tech Stack

- React with TypeScript
- Express.js backend
- Web Push for notifications
- Recharts for analytics visualization
- TanStack Query for data fetching
- Shadcn/ui for UI components
- Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.