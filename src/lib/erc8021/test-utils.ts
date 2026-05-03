import { generateAttributionSuffix } from './utils';

export const mockTestCases = [
  {
    name: 'Schema 0 Default',
    run: () => {
      const suffix = generateAttributionSuffix();
      return suffix.includes('8021');
    }
  }
];
