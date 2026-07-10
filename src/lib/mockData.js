export const mockResponse = {
  topic: 'Photosynthesis',
  flashcards: [
    {
      id: 'fc-1',
      front: 'What is photosynthesis?',
      back: 'The process by which green plants use sunlight, water, and CO₂ to produce glucose and oxygen.',
    },
    {
      id: 'fc-2',
      front: 'Where does the light-dependent reaction take place?',
      back: 'In the thylakoid membranes of the chloroplast.',
    },
    {
      id: 'fc-3',
      front: 'What is the Calvin cycle?',
      back: 'The light-independent (dark) reactions in the stroma that use ATP and NADPH to fix CO₂ into glucose.',
    },
    {
      id: 'fc-4',
      front: 'What pigment primarily absorbs light for photosynthesis?',
      back: 'Chlorophyll, which absorbs red and blue light most effectively and reflects green light.',
    },
  ],
  quiz: [
    {
      id: 'qz-1',
      question:
        'Which molecule is the primary product of the light-dependent reactions used in the Calvin cycle?',
      options: ['Glucose', 'ATP and NADPH', 'Oxygen', 'Carbon dioxide'],
      correctIndex: 1,
      explanation:
        'The light-dependent reactions produce ATP and NADPH, which power the Calvin cycle to fix CO₂ into glucose.',
    },
    {
      id: 'qz-2',
      question: 'In which part of the chloroplast does the Calvin cycle occur?',
      options: ['Thylakoid membrane', 'Outer membrane', 'Stroma', 'Granum'],
      correctIndex: 2,
      explanation:
        'The Calvin cycle takes place in the stroma, the fluid-filled space surrounding the thylakoids.',
    },
    {
      id: 'qz-3',
      question:
        'What gas is released as a by-product of the light-dependent reactions?',
      options: ['Carbon dioxide', 'Nitrogen', 'Hydrogen', 'Oxygen'],
      correctIndex: 3,
      explanation:
        'Water molecules are split during the light-dependent reactions, releasing oxygen as a by-product.',
    },
    {
      id: 'qz-4',
      question:
        'Which colour of light does chlorophyll reflect, making plants appear green?',
      options: ['Red', 'Blue', 'Green', 'Yellow'],
      correctIndex: 2,
      explanation:
        'Chlorophyll absorbs red and blue light for photosynthesis but reflects green light, which is why plants look green.',
    },
  ],
};
