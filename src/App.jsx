import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { apiUrl } from './config/api';

// Components
import Landing from './components/Landing';
import PersonalInfo from './components/PersonalInfo';
import ProfessionalInfo from './components/ProfessionalInfo';
import ExperienceList from './components/ExperienceList';
import Review from './components/Review';
import Success from './components/Success';
import logo from './assets/logo.png';
import logoWhite from './assets/logo-white.png';
import logoWhiteTransp from './assets/logo-white-transp.png';

import { validateCPF } from './utils/validators';

const schema = z.object({
  fullName: z.string().min(3, 'Nome completo é obrigatório'),
  nomeVaga: z.string().min(2, 'Nome da vaga é obrigatório'),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  phone: z.string().min(10, 'Celular inválido'),
  foneRes: z.string().optional(),
  foneRecado: z.string().optional(),
  falarCom: z.string().optional(),
  dataNascimento: z.string().optional(),
  estadoNasceu: z.string().optional(),
  cidadeNasceu: z.string().optional(),
  trabalhouNaEmpresa: z.boolean().optional(),
  parentesNaEmpresa: z.boolean().optional(),
  portadorDeficiencia: z.boolean().optional(),
  nomePai: z.string().optional(),
  nomeMae: z.string().optional(),
  estadoCivil: z.string().optional(),
  rgDataEmissao: z.string().optional(),
  rgEstadoEmissor: z.string().optional(),
  cnhValidade: z.string().optional(),
  cnhCategoria: z.string().optional(),
  cpf: z.string().refine((val) => !val || validateCPF(val), {
    message: 'CPF inválido',
  }),
  raca: z.string().optional(),
  pis: z.string().optional(),
  trabalhoTurnos: z.boolean().optional(),
  trabalhoTemporario: z.boolean().optional(),
  tamanhoCalca: z.string().optional(),
  tamanhoCamiseta: z.string().optional(),
  tamanhoSapato: z.string().optional(),
  escolaridade: z.string().optional(),
  outrosCursos: z.string().optional(),
  continuaEstudando: z.boolean().optional(),
  cidade: z.string().optional(),
  cep: z.string().optional(),
  bairro: z.string().optional(),
  idade: z.string().optional(),
  email: z.string().email('E-mail inválido').or(z.string().length(0)).optional(),
  rg: z.string().optional(),
  descreva: z.string().optional(),
  cnh: z.string().optional(),
  curso: z.string().optional(),
  ano: z.string().optional(),
});

const steps = [
  { id: 'step1', title: 'Identificação' },
  { id: 'step2', title: 'Documentos' },
  { id: 'step3', title: 'Perfil' },
  { id: 'review', title: 'Revisão' },
];

function App() {
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '', nomeVaga: '', endereco: '', numero: '', complemento: '',
      phone: '', foneRes: '', foneRecado: '', falarCom: '', dataNascimento: '',
      estadoNasceu: '', cidadeNasceu: '', trabalhouNaEmpresa: false,
      parentesNaEmpresa: false, portadorDeficiencia: false, nomePai: '',
      nomeMae: '', estadoCivil: '', rgDataEmissao: '', rgEstadoEmissor: '',
      cnhValidade: '', cnhCategoria: '', cpf: '', raca: '', pis: '', trabalhoTurnos: false,
      trabalhoTemporario: false, tamanhoCalca: '', tamanhoCamiseta: '',
      tamanhoSapato: '', escolaridade: '', outrosCursos: '', continuaEstudando: false,
      cidade: '', cep: '', bairro: '', idade: '', email: '', rg: '', descreva: '', cnh: '', curso: '', ano: ''
    },
    mode: 'onChange',
  });

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await methods.trigger(fields);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 0: return ['fullName', 'nomeVaga', 'phone'];
      case 1: return [];
      case 2: return [];
      default: return [];
    }
  };

  const onSubmit = async (data) => {
    if (currentStep !== steps.length - 1) {
      nextStep();
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(apiUrl('/api/applications'), data);
      setResultData(response.data);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Erro ao enviar formulário. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (isSubmitted) {
    return <Success data={resultData} />;
  }

  if (!showForm) {
    return <Landing 
      onStart={() => setShowForm(true)} 
      theme={theme} 
      logo={logo} 
      logoWhite={logoWhiteTransp} 
    />;
  }

  const logoHeight = theme === 'light' ? '60px' : '68px';

  return (
    <div className="app-container">
      <div className="glass-card">
        <div className="p-8">
          <header className="flex-between mb-8">
            <div>
              <img 
                src={theme === 'light' ? logoWhite : logo} 
                alt="Logo" 
                style={{ height: logoHeight, width: 'auto', marginBottom: '1.25rem', display: 'block' }} 
              />
              <h1>Candidatura</h1>
              <p className="text-muted">Inicie sua jornada conosco preenchendo os dados abaixo.</p>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="btn btn-ghost"
              aria-label="Alternar tema"
              style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px' }}
            >
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              )}
            </button>
          </header>

          <div className="stepper-container">
            <div className="stepper-line">
              <div 
                className="stepper-line-active" 
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`step-item ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              >
                <div className="step-circle">
                  {index < currentStep ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : index + 1}
                </div>
                <span className="step-label">{step.title}</span>
              </div>
            ))}
          </div>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 0 && <PersonalInfo />}
                  {currentStep === 1 && <ProfessionalInfo />}
                  {currentStep === 2 && <ExperienceList />}
                  {currentStep === 3 && <Review />}
                </motion.div>
              </AnimatePresence>

              <footer className="flex-between" style={{ marginTop: '3rem' }}>
                <button 
                  type="button" 
                  onClick={prevStep} 
                  className="btn btn-ghost"
                  style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
                  disabled={isLoading}
                >
                  Voltar
                </button>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : (currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo')}
                  {currentStep < steps.length - 1 && !isLoading && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  )}
                </button>
              </footer>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
