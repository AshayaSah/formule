import { NextResponse } from 'next/server';
import path from 'path';
import * as fs from 'fs/promises';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const route = searchParams.get('route');

  if (!route) {
    return NextResponse.json({ error: 'Missing route parameter' }, { status: 400 });
  }

  const configPath = path.join(process.cwd(), 'app', 'components', `${route}-formConfig.json`);
  try {
    const fileContent = await fs.readFile(configPath, 'utf8');
    const formConfig = JSON.parse(fileContent);
    return NextResponse.json({ fields: formConfig.fields || [] });
  } catch (error) {
    console.error('Error loading form config:', error);
    return NextResponse.json({ fields: [] }, { status: 404 }); // Return 404 for file not found
  }
}