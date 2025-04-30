# Spatial Laser - Property Zoning Management Application

## Overview

Spatial Laser is a powerful tool for property zoning management, offering features such as:

- Viewing properties on an interactive map.
- Managing multiple properties simultaneously.
- Accessing detailed property information.
- Updating zoning types for selected properties.
- Analyzing statistics and metrics for selected properties.

## Tech Stack

Spatial Laser utilizes modern web technologies to provide a seamless and efficient user experience:

- **React 19 with TypeScript**: Ensures a robust, type-safe component architecture.
- **Vite**: Delivers fast development and build processes.
- **Tailwind CSS**: Enables responsive styling, enhanced with ShadCN UI components.
- **Leaflet**: Powers interactive mapping and geospatial visualization.
- **TanStack Query (React Query)**: Optimizes API data fetching and caching.
- **Turf.js**: Supports advanced geospatial calculations and analysis.
  **Supercluster**: Enables high-performance clustering of map points, ensuring smooth and efficient visualization of large datasets on interactive maps.

## Features

### Interactive Map

- Visualize property polygons on an interactive map.
- Handle large datasets with clustering capabilities.
- Select properties directly by clicking on the map.
- View property boundaries and associated details.

### Property Management

- Access detailed property information via a collapsible sidebar.
- Select multiple properties for batch operations.
- Update zoning types for one or more properties.
- Analyze aggregated statistics and metrics for selected properties.

### User Interface

- Fully responsive design for desktop and mobile devices.
- Toggle between dark and light themes.
- Collapsible sidebar to maximize map viewing space.

### Advanced Clustering

The application uses Supercluster for efficient handling of large property datasets:

- **Polygon-to-Point Conversion**: Property polygons are converted to centroid points using Turf.js's centroid function, allowing the clustering algorithm to work with points instead of complex polygons.

## Getting Started

### Prerequisites

Ensure the following are installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/spatial-laser-frontend.git
cd spatial-laser-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.sample .env
```

Edit the `.env` file and set `VITE_API_BASE_URL` to point to your backend API.

### Development

Start the development server:

```bash
npm run dev
```

### Building for Production

Build the application for production:

```bash
npm run build
```

### API Code Generation

The project uses OpenAPI code generation to create TypeScript types and React Query hooks:

Please refer to https://github.com/fabien0102/openapi-codegen

- Generate API from the production endpoint:

  ```bash
  npm run api-codegen
  ```

- Generate API from the local development endpoint:

  ```bash
  npm run api-codegen-dev
  ```

## Architecture

The project is organized into the following directories:

- **`components`**: UI components organized by feature.
- **`hooks`**: Custom React hooks for shared logic.
- **`generated-api`**: Auto-generated API clients from the OpenAPI specification.
- **`pages`**: Page components representing different routes.
- **`constants`**: Application constants.
- **`lib`**: Utility functions and shared code.

## Deployment

The application is configured for continuous deployment via GitHub Actions to Render.com.
