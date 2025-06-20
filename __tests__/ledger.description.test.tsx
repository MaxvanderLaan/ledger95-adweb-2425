import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Page from '../app/notepad/[ledgerId]/description/page';
import { getDoc, doc } from 'firebase/firestore';

// Mock ledger document data
const mockLedger = {
  id: 'aP8pZ1fDbNhmsiKeBZND',
  name: 'Test Ledger A',
  description: 'This is a description of Test Ledger A',
  archived: false,
};

// Mock Firestore getDoc to return the mock ledger document
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(() =>
    Promise.resolve({
      exists: () => true,
      id: mockLedger.id,
      data: () => mockLedger,
    })
  ),
}));

// Mock next/navigation useParams to return ledgerId
jest.mock('next/navigation', () => ({
  useParams: () => ({
    ledgerId: 'aP8pZ1fDbNhmsiKeBZND',
  }),
}));

// Mock Next.js built-ins
jest.mock('next/image', () => (props: any) => <img {...props} alt={props.alt || 'mocked image'} />);
jest.mock('next/link', () => ({ children }: { children: React.ReactNode }) => <>{children}</>);

// Mock Firebase
jest.mock('../firebase', () => ({
  db: {},
}));

//Als gebruiker wil ik een overzicht van mijn huishoudboekjes kunnen bekijken met naam en
//omschrijving
describe('Notepad description Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays the ledger description', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText(/This is a description of Test Ledger A/i)).toBeInTheDocument();
    });
  });
});