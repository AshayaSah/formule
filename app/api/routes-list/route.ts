import { NextResponse } from 'next/server';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import formConfig from "../../formule/form-list/formConfig.json"

export async function POST(request: Request) {
  try {
    const { newRoute } = await request.json();
    
    const data = JSON.parse(formConfig);
    
    console.log(data)
    
    if (!newRoute) {
      return NextResponse.json({ error: 'Missing route' }, { status: 400 });
    }

    const routePath = path.join(process.cwd(), 'app/formule/form-list');
    console.log(`Creating directory: ${routePath}`);
    mkdirSync(routePath, { recursive: true });

    const configPath = path.join(routePath, 'formConfig.json');
    console.log(`Writing formConfig.json to: ${newRoute}`); 
    writeFileSync(configPath, JSON.stringify(newRoute, null, 2));

    return NextResponse.json({ message: `Form published to app/${newRoute}` });
  } catch (error) {
    console.error('Error publishing form:', error);
    return NextResponse.json({ error: 'Failed to publish form' }, { status: 500 });
  }
}