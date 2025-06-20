import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '../app/dashboard/ledger/page';
import { getDocs } from 'firebase/firestore';

// Mock data
const mockLedgers = [
  {
    id: '1',
    name: 'Test Ledger A',
    description: 'Description A',
    archived: false,
  },
  {
    id: '2',
    name: 'Test Ledger B',
    description: 'Description B',
    archived: false,
  },
];

// Mock Firebase
jest.mock('../firebase', () => ({
  db: {},
}));

// Mock Firestore methods
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(() =>
    Promise.resolve({
      docs: mockLedgers.map((ledger) => ({
        id: ledger.id,
        data: () => ledger,
      })),
    })
  ),
}));

// Ledger context
const setLedgerMock = jest.fn();

jest.mock('../context/LedgerContext', () => ({
  useLedger: () => ({
    ledger: null,
    setLedger: setLedgerMock,
  }),
}));

// Mock Next.js components that don’t work well in tests
jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt || 'mocked image'} />;
});

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => <>{children}</>;
});

//Als gebruiker wil ik een overzicht van mijn huishoudboekjes kunnen bekijken met naam en
//omschrijving
describe('Ledger Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

    it('fetches and displays ledgers from Firestore', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Test Ledger A')).toBeInTheDocument();
      expect(screen.getByText('Test Ledger B')).toBeInTheDocument();
    });
  });
})