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

    const componentsPath = path.join(process.cwd(), 'app', 'components');
    console.log(`Using components directory: ${componentsPath}`);
    mkdirSync(componentsPath, { recursive: true });

    const configPath = path.join(componentsPath, `${route}-formConfig.json`);
    console.log(`Writing formConfig.json to: ${configPath}`);
    writeFileSync(configPath, JSON.stringify(formConfig, null, 2));

    return NextResponse.json({ message: `Form config saved to app/components/${route}-formConfig.json` });
  } catch (error) {
    console.error('Error publishing form:', error);
    return NextResponse.json({ error: 'Failed to publish form' }, { status: 500 });
  }
}