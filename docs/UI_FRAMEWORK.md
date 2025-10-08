# UI Framework Documentation

## PrimeVue Integration

### Overview
- **Framework**: PrimeVue 4 with full component library
- **Icons**: PrimeIcons
- **Theming**: PrimeVue Themes (@primevue/themes)
- **Auto-Import**: Components auto-imported via unplugin-vue-components

### Theme Configuration

#### AppSettings Component
- Located in `layout/AppSettings.vue`
- Manages user preferences
- Stored in localStorage
- Configurable options:
  - Color scheme (light/dark)
  - Menu mode
  - Input style
  - Ripple effect

#### AppConfigurator Component
- Located in `layout/AppConfigurator.vue`
- Dynamic theme configuration panel
- Real-time preview
- Theme customization options

## Layout System

### AppLayout (`layout/AppLayout.vue`)
Main layout wrapper that provides the application structure:
- Header (AppTopbar)
- Sidebar (AppSidebar)
- Main content area
- Footer (AppFooter)
- Responsive breakpoints

### AppTopbar (`layout/AppTopbar.vue`)
Top navigation bar featuring:
- Logo/branding
- User menu with profile picture
- Notifications dropdown
- Search functionality
- Mobile menu toggle

### AppSidebar (`layout/AppSidebar.vue`)
Side navigation panel:
- Collapsible menu
- AppMenu component integration
- Responsive design
- State persistence

### AppMenu (`layout/AppMenu.vue`)
Main navigation menu:
- Hierarchical menu structure
- AppMenuItem components
- Route-based active states
- Icon support

### AppFooter (`layout/AppFooter.vue`)
Footer component with customizable content

## Dashboard

### Dashboard Widgets

Located in `components/dashboard/`:

**StatsWidget**
- Key metrics display
- Icon support
- Color-coded values
- Trend indicators

**RevenueStreamWidget**
- Revenue visualization
- Chart.js integration
- Time-series data
- Interactive legends

**RecentSalesWidget**
- Recent transactions table
- Sortable columns
- Pagination
- Action buttons

**BestSellingWidget**
- Top products/symbols
- Performance metrics
- Visual indicators

**NotificationsWidget**
- Activity feed
- Real-time updates
- Action links
- Badge indicators

### Charts
- **Library**: Chart.js 4
- **Integration**: Dedicated ChartDoc demo
- **Types**: Line, Bar, Pie, Doughnut, etc.
- **Responsiveness**: Auto-resize

## UI Kit Demos

Complete PrimeVue component demonstrations in `views/uikit/`:

### Component Categories

**Form Components**
- `InputDoc.vue`: Text inputs, TextArea, Number inputs, etc.
- `FormLayout.vue`: Form layout examples and patterns
- `ButtonDoc.vue`: Button variants, sizes, icons

**Data Display**
- `TableDoc.vue`: DataTable with sorting, filtering, pagination, selection
- `ListDoc.vue`: OrderList, PickList, DataView
- `TreeDoc.vue`: Tree, TreeTable components

**Navigation**
- `MenuDoc.vue`: Menubar, TieredMenu, Breadcrumb, Steps, TabMenu
- `PanelsDoc.vue`: Panel, Accordion, TabView, Toolbar

**Overlay**
- `OverlayDoc.vue`: Dialog, Sidebar, Tooltip, ConfirmDialog

**Media**
- `MediaDoc.vue`: Image, Carousel, Galleria

**Messages**
- `MessagesDoc.vue`: Message, Toast, InlineMessage

**Data Visualization**
- `ChartDoc.vue`: Chart.js integration examples
- `TimelineDoc.vue`: Timeline component

**File**
- `FileDoc.vue`: FileUpload component

**Misc**
- `MiscDoc.vue`: ProgressBar, Badge, Avatar, Chip, Tag, etc.

## Landing Page Components

Located in `components/landing/`:

- **HeroWidget**: Hero section with CTA
- **FeaturesWidget**: Feature highlights grid
- **HighlightsWidget**: Key selling points
- **PricingWidget**: Pricing tiers
- **TopbarWidget**: Landing page navigation
- **FooterWidget**: Landing page footer

## Styling

### Tailwind CSS
- Utility-first CSS framework
- Custom configuration in `tailwind.config.js`
- PrimeVue integration
- Responsive design utilities

### Sass
- Component-specific styles
- Layout variables in `assets/layout/`
- Theme customization
- Mixins and utilities

### PostCSS
- Configuration in `postcss.config.js`
- Autoprefixer for browser compatibility
- CSS optimization

## Legacy Components

### Demo Services
Located in `src/service/` (legacy):
- `CountryService.js`: Country data for demos
- `CustomerService.js`: Customer data for tables
- `NodeService.js`: Tree node data
- `PhotoService.js`: Image gallery data
- `ProductService.js`: Product catalog data

These services provide mock data for UI kit demonstrations and can be removed in production.

## Best Practices

### Component Development
1. Use Vue 3 Composition API
2. Follow PrimeVue component patterns
3. Leverage auto-import for PrimeVue components
4. Use TypeScript for type safety
5. Store user preferences in AppSettings

### Theming
1. Use AppConfigurator for theme testing
2. Follow PrimeVue theming guidelines
3. Maintain consistent color palette
4. Test light/dark mode compatibility

### Responsive Design
1. Use PrimeVue responsive utilities
2. Test on multiple breakpoints
3. Mobile-first approach
4. Collapsible sidebar for mobile

## Future Enhancements

- Integration of custom trading components into Dashboard
- Remove/archive legacy UI kit demo pages for production
- Custom theme creation
- Component library expansion
- Advanced data visualization components
