import { useContext } from 'react';

import { CharacterContext } from '../CharacterContext';

export const useCharacterState = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error(
      'useCharacterState must be used within a CharacterProvider'
    );
  }
  return context;
};
