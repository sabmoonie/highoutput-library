import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';

import InputField from './InputField';

describe('Input Field Component', () => {
  afterEach(cleanup);

  beforeEach(() => {
    render(
      <InputField
        id="name"
        name="name"
        placeholder="Input your name"
        leftIcon={<>left</>}
        rightIcon={<>right</>}
      />
    );
  });

  it('should renders input field form container', async () => {
    const formControl = await screen.findAllByTestId(
      'formcontainer.formcontrol'
    );
    expect(formControl).toHaveLength(1);
  });

  it('should renders input field input group', async () => {
    const inputGroup = await screen.findAllByTestId('inputfield.inputgroup');
    expect(inputGroup).toHaveLength(1);
  });

  it('should renders input field input', async () => {
    const input = await screen.findAllByTestId('inputfield.input');
    expect(input).toHaveLength(1);
  });

  it('should renders input field left element', async () => {
    const leftELement = await screen.findAllByTestId('inputfield.leftelement');
    expect(leftELement).toHaveLength(1);
  });

  it('should renders input field right element', async () => {
    const rightELement = await screen.findAllByTestId(
      'inputfield.rightelement'
    );
    expect(rightELement).toHaveLength(1);
  });
});
