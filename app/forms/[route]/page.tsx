import { Formule } from '../../components/Formule';
import path from 'path';
import { promises as fsPromises } from 'fs';

export default async function DynamicFormPage({
    params
}: {
    params: Promise<{ route?: string }>
}) {
    const resolvedParams = await params;
    console.log('Params:', resolvedParams);
    const route = resolvedParams.route;

    if (!route) {
        return <div className="container mx-auto p-4">Form ID is missing</div>;
    }

    const configPath = path.join(process.cwd(), 'app', 'components', `${route}-formConfig.json`);
    console.log('Config path:', configPath);

    let formConfig;
    try {
        const fileContent = await fsPromises.readFile(configPath, 'utf8');
        formConfig = JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading config file:', error);
        return <div className="container mx-auto p-4">Error loading form configuration</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Formule config={formConfig} />
        </div>
    );
}