# LIPMS - Live Pharmacy Inventory Management System

A modern, responsive web application for managing pharmacy inventory, built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Dashboard**: Real-time overview of inventory status, sales metrics, and alerts
- **Inventory Management**: Track stock levels, expiry dates, and supplier information
- **Product Catalog**: Manage product information, categories, and pricing
- **Supplier Management**: Maintain supplier contacts and relationships
- **Reports & Analytics**: Generate comprehensive reports and insights
- **Settings**: Customize system preferences and notifications

### Key Capabilities
- ✅ Real-time stock level monitoring
- ✅ Low stock and expiry date alerts
- ✅ Multi-category product organization
- ✅ Supplier relationship management
- ✅ Sales and inventory reporting
- ✅ Responsive design for all devices
- ✅ Modern, intuitive user interface

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript support

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lipms-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   ├── inventory/       # Inventory management components
│   ├── layout/          # Layout components (Header, Sidebar)
│   ├── products/        # Product management components
│   └── ui/              # Generic UI components
├── pages/               # Page components
│   ├── Dashboard.tsx
│   ├── Inventory.tsx
│   ├── Products.tsx
│   ├── Suppliers.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── hooks/               # Custom React hooks
├── services/            # API services
├── store/               # State management
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── App.tsx              # Main app component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## 🎨 Design System

The application uses a custom design system built on Tailwind CSS with:

- **Primary Colors**: Blue-based palette for primary actions
- **Pharmacy Colors**: Green-based palette for health/pharmacy themes
- **Status Colors**: Warning (yellow), Danger (red), Success (green)
- **Typography**: Inter font family for clean readability
- **Components**: Consistent button styles, cards, inputs, and modals

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=LIPMS
VITE_APP_VERSION=1.0.0
```

### Tailwind Configuration
The `tailwind.config.js` file includes custom color schemes and component classes optimized for pharmacy management interfaces.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Adaptive layout with collapsible sidebar
- **Mobile**: Touch-friendly interface with mobile navigation

## 🧪 Development

### Code Style
- Use TypeScript for type safety
- Follow React best practices and hooks
- Use Tailwind CSS for styling
- Implement proper error handling
- Write accessible HTML

### Component Guidelines
- Create reusable components in `src/components/ui/`
- Use proper TypeScript interfaces
- Implement responsive design
- Follow naming conventions (PascalCase for components)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Options
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist/` folder
- **AWS S3**: Upload the `dist/` folder to an S3 bucket
- **Azure Static Web Apps**: Deploy directly from GitHub

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: [Your Name]
- **Backend Development**: [Backend Developer Name]
- **UI/UX Design**: [Designer Name]
- **Project Manager**: [PM Name]

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

---

**LIPMS** - Streamlining pharmacy operations with modern technology.
