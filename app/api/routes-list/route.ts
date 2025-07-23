import { NextResponse } from 'next/server';
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { newRoute } = await request.json();

    if (!newRoute) {
      return NextResponse.json({ error: 'Missing route' }, { status: 400 });
    }

    const routePath = path.join(process.cwd(), 'app', 'components', 'routes-list');
    console.log(`Creating directory: ${routePath}`);
    mkdirSync(routePath, { recursive: true });

    const configPath = path.join(routePath, 'formConfig.json');
    let routes = [];

    // Read existing routes if the file exists
    try {
      const fileContent = readFileSync(configPath, 'utf8');
      routes = JSON.parse(fileContent).routes || [];
    } catch (readError) {
      console.log('No existing config file or error reading, starting with empty array');
    }

    // Check for duplicate routes
    if (routes.some((routeObj: { route: any; }) => routeObj.route === newRoute)) {
      return NextResponse.json({ error: 'Route already exists' }, { status: 400 });
    }

    // Add new route
    routes.push({ name: newRoute, route: newRoute });

    // Write updated routes back to the file
    writeFileSync(configPath, JSON.stringify({ routes }, null, 2));
    console.log(`Writing updated formConfig.json to: ${configPath}`);

    return NextResponse.json({ message: `Form published to app/components/routes-list` });
  } catch (error) {
    console.error('Error publishing form:', error);
    return NextResponse.json({ error: 'Failed to publish form' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const routePath = path.join(process.cwd(), 'app', 'components', 'routes-list');
    const configPath = path.join(routePath, 'formConfig.json');
    let routes = [];

    // Read existing routes if the file exists
    try {
      const fileContent = readFileSync(configPath, 'utf8');
      routes = JSON.parse(fileContent).routes || [];
    } catch (readError) {
      console.log('No existing config file or error reading, returning empty array');
    }

    return NextResponse.json({ routes });
  } catch (error) {
    console.error('Error fetching routes:', error);
    return NextResponse.json({ error: 'Failed to fetch routes' }, { status: 500 });
  }
}