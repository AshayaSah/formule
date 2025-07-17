import { Formule } from '../components/Formule';
    import formConfig from './formConfig.json';

export default function FormPage() {
  return (
    <div className="container mx-auto p-4">
      <Formule config={formConfig} />
    </div>
  );
} 