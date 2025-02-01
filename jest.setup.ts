import '@testing-library/jest-dom';

// Mock TextEncoder qui est utilisé par jose
global.TextEncoder = require('util').TextEncoder; 