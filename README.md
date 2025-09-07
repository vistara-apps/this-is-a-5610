# ContentSpark 🚀

**Ignite your content with interactive elements and AI insights.**

ContentSpark is a powerful web application that transforms static content into engaging, interactive experiences. Add polls, quizzes, and AI-powered summaries to your content, then easily embed them across any platform.

![ContentSpark Demo](https://via.placeholder.com/800x400/1e40af/ffffff?text=ContentSpark+Demo)

## ✨ Features

### 🎯 Core Features
- **Interactive Elements Integration**: Embed polls, quizzes, and clickable hotspots directly into your content
- **AI-Powered Content Summarization**: Automatically generate concise summaries and key takeaways
- **Content Embedding & Sharing**: Get embeddable widgets for easy integration across platforms
- **User Authentication**: Secure user accounts with Supabase Auth
- **Subscription Management**: Tiered pricing with feature access control

### 🎨 Design System
- **Modern UI**: Built with Tailwind CSS and custom design tokens
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Dark Mode Ready**: Prepared for future dark mode implementation

### 🔧 Technical Features
- **Real-time Database**: Powered by Supabase with Row Level Security
- **AI Integration**: OpenAI/OpenRouter API for intelligent content processing
- **Analytics Tracking**: Built-in user behavior analytics
- **Performance Optimized**: Fast loading with code splitting and lazy loading

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (for database and auth)
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-5610.git
   cd this-is-a-5610
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up Supabase database**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Initialize Supabase (if not already done)
   supabase init
   
   # Start local development
   supabase start
   
   # Apply database migrations
   supabase db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📊 Database Schema

ContentSpark uses a PostgreSQL database with the following main tables:

### Users
- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `subscription_tier` (Text: 'free', 'pro', 'premium')
- `created_at`, `updated_at` (Timestamps)

### Content Items
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `title` (Text)
- `content_text` (Text)
- `original_content_url` (Text, Optional)
- `interactive_elements_config` (JSONB)
- `ai_summary` (Text, Optional)
- `created_at`, `updated_at` (Timestamps)

### Interactive Elements
- `id` (UUID, Primary Key)
- `content_item_id` (UUID, Foreign Key)
- `type` (Text: 'poll', 'quiz', 'hotspot')
- `config` (JSONB)
- `created_at` (Timestamp)

### User Analytics
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `content_item_id` (UUID, Foreign Key, Optional)
- `action_type` (Text)
- `metadata` (JSONB)
- `created_at` (Timestamp)

## 🎯 User Flows

### Content Enhancement Flow
1. User uploads/links content
2. User selects/configures interactive elements (polls/quizzes)
3. User triggers AI summarization
4. User previews enhanced content
5. User copies embed code for selected elements/summary
6. User publishes content elsewhere

### User Onboarding & Subscription
1. User signs up/logs in via Supabase Auth
2. User visits pricing page
3. User selects a subscription tier
4. User completes payment (future: Stripe integration)
5. User accesses Pro/Premium features

## 💰 Subscription Tiers

### Free Tier
- ✅ 3 interactive elements per month
- ✅ 5 content items storage
- ❌ AI summaries
- ❌ Advanced analytics

### Pro Tier ($15/month)
- ✅ Unlimited interactive elements
- ✅ Unlimited content items
- ✅ AI-powered summaries
- ✅ Basic analytics
- ❌ Priority support

### Premium Tier ($30/month)
- ✅ Everything in Pro
- ✅ Advanced analytics
- ✅ Priority support
- ✅ Custom branding (future)
- ✅ API access (future)

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── AuthModal.jsx   # Authentication modal
│   ├── Header.jsx      # App header with navigation
│   ├── ContentUploader.jsx
│   ├── InteractiveElementBuilder.jsx
│   ├── AISummaryGenerator.jsx
│   ├── EmbeddableWidget.jsx
│   └── PricingTiers.jsx
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state management
├── lib/               # Utility libraries
│   └── supabase.js    # Supabase client and helpers
├── App.jsx           # Main app component
├── main.jsx         # App entry point
└── index.css        # Global styles

supabase/
├── config.toml      # Supabase configuration
└── migrations/      # Database migrations
    └── 001_initial_schema.sql
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Database
supabase start       # Start local Supabase
supabase stop        # Stop local Supabase
supabase db reset    # Reset database
supabase db push     # Apply migrations

# Docker
docker build -t contentspark .
docker run -p 3000:3000 contentspark
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `VITE_OPENAI_BASE_URL` | Custom OpenAI endpoint | No |
| `VITE_APP_ENV` | Environment (development/production) | No |

## 🚢 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting platform**
   - **Vercel**: Connect your GitHub repo and deploy automatically
   - **Netlify**: Drag and drop the `dist` folder or connect via Git
   - **Docker**: Use the included Dockerfile

3. **Set up production Supabase**
   - Create a new Supabase project
   - Apply migrations: `supabase db push --linked`
   - Update environment variables with production URLs

4. **Configure environment variables**
   Set production environment variables in your hosting platform.

### Docker Deployment

```bash
# Build image
docker build -t contentspark .

# Run container
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=your_url \
  -e VITE_SUPABASE_ANON_KEY=your_key \
  -e VITE_OPENAI_API_KEY=your_key \
  contentspark
```

## 🔐 Security

- **Row Level Security**: All database tables use RLS policies
- **Authentication**: Secure JWT-based auth via Supabase
- **API Keys**: Environment variables for sensitive data
- **CORS**: Properly configured for production domains
- **Input Validation**: Client and server-side validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Add tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR
- Use conventional commit messages

## 📝 API Documentation

### Authentication Endpoints

All authentication is handled by Supabase Auth:

- `POST /auth/v1/signup` - User registration
- `POST /auth/v1/token?grant_type=password` - User login
- `POST /auth/v1/logout` - User logout
- `POST /auth/v1/recover` - Password reset

### Database API

Supabase provides auto-generated REST API:

- `GET /rest/v1/content_items` - Get user's content items
- `POST /rest/v1/content_items` - Create new content item
- `PATCH /rest/v1/content_items?id=eq.{id}` - Update content item
- `DELETE /rest/v1/content_items?id=eq.{id}` - Delete content item

## 🐛 Troubleshooting

### Common Issues

**Database connection errors**
- Verify Supabase URL and keys in `.env`
- Check if local Supabase is running: `supabase status`

**AI features not working**
- Verify OpenAI API key is valid
- Check API quota and billing status
- Ensure network connectivity to OpenAI/OpenRouter

**Build errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version compatibility (18+)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for backend infrastructure
- [OpenAI](https://openai.com) for AI capabilities
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide React](https://lucide.dev) for icons
- [Vite](https://vitejs.dev) for build tooling

---

**Built with ❤️ by the ContentSpark team**

For support, email us at support@contentspark.com or create an issue on GitHub.
