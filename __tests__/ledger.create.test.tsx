import 'whatwg-fetch';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '../app/(dashboard-actions)/dashboard/create/page';

jest.mock('../firebase', () => ({
  auth: {},
  db: {},
}));

// Mock firestore methods used in the component
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => ({})),
  addDoc: jest.fn(),
}));

import { collection, addDoc } from 'firebase/firestore';

// Mock AuthContext for user presence
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-user-123' },
  }),
}));

// Mock Next.js built-ins
jest.mock('next/image', () => (props: any) => <img {...props} alt={props.alt || 'mocked image'} />);
jest.mock('next/link', () => ({ children }: { children: React.ReactNode }) => <>{children}</>);

// Mock next/navigation useRouter
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

//Als gebruiker wil ik een huishoudboekje kunnen toevoegen/aanpassen
describe('Ledger Creation Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits a valid ledger and redirects', async () => {
    (addDoc as jest.Mock).mockResolvedValueOnce({ id: 'fakeDocId' });

    render(<Page />);

    fireEvent.change(screen.getByPlaceholderText(/Name of new ledger/i), {
      target: { value: 'My Ledger' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Description of new ledger/i), {
      target: { value: 'My ledger description' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create/i }));

    await waitFor(() => {
      expect(collection).toHaveBeenCalledWith(expect.anything(), 'ledgers');
      expect(addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          name: 'My Ledger',
          description: 'My ledger description',
          owner: 'test-user-123',
          members: {},
        })
      );
      expect(pushMock).toHaveBeenCalledWith('/dashboard');
    });
  });
});
