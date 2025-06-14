import login from './login';
import meditation from './meditation';
import home from './home';
import validation from './validation';

const translation = {
  app_name: "medimate app",
  login,
  meditation,
  home,
  validation,
} as const;

export default translation