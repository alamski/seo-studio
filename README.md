# SEO Studio

A web application for SEO professionals to analyze and optimize their websites using Screaming Frog SEO Spider crawl exports.

## Features

- 📊 Upload and process Screaming Frog SEO Spider crawl exports
- 📈 Interactive visualizations of SEO metrics
- 🤖 AI-powered insights and recommendations
- 💬 Chat interface for SEO queries
- 🌓 Dark/Light mode support
- 📱 Responsive design

## Tech Stack

- React with TypeScript
- Vite for build tooling
- Chakra UI for components
- React Router for navigation
- PapaParse for CSV parsing
- OpenAI API for AI features (coming soon)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd seo-studio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

1. Upload a CSV file exported from Screaming Frog SEO Spider
2. View the analysis dashboard
3. Check detailed crawl analysis
4. Use the chat interface for AI-powered insights (coming soon)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React context providers
├── pages/         # Page components
├── services/      # API and analysis services
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── theme.ts       # Chakra UI theme configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Screaming Frog SEO Spider for the crawl data format
- Chakra UI for the component library
- React community for the amazing ecosystem 