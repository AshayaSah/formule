import { NextResponse } from 'next/server';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { route, formConfig } = await request.json();

    if (!route || !formConfig) {
      return NextResponse.json({ error: 'Missing route or formConfig' }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9-]+$/.test(route)) {
      return NextResponse.json({ error: 'Invalid route name' }, { status: 400 });
    }

    const routePath = path.join(process.cwd(), 'app', route);
    console.log(`Creating directory: ${routePath}`);
    mkdirSync(routePath, { recursive: true });

    const configPath = path.join(routePath, 'formConfig.json');
    console.log(`Writing formConfig.json to: ${configPath}`);
    writeFileSync(configPath, JSON.stringify(formConfig, null, 2));

    const pageContent = `import { Formule } from '../components/Formule';
    import formConfig from './formConfig.json';

export default function FormPage() {
  return (
    <div className="container mx-auto p-4">
      <Formule config={formConfig} />
    </div>
  );
} `;
    const pagePath = path.join(routePath, 'page.tsx');
    console.log(`Writing page.tsx to: ${pagePath}`);
    writeFileSync(pagePath, pageContent);

    return NextResponse.json({ message: `Form published to app/${route}` });
  } catch (error) {
    console.error('Error publishing form:', error);
    return NextResponse.json({ error: 'Failed to publish form' }, { status: 500 });
  }
}