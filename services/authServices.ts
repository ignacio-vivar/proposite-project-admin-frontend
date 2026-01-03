interface Token {
  access_token: string;
  token_type: string;
}

type AuthHandlers = {
  login: (tokenObj: Token) => void;
  logout: () => void;
};

let handlers: AuthHandlers = {
  login: () => { },
  logout: () => { },
};

export const setAuthHandlers = (newHandlers: AuthHandlers) => {
  handlers = newHandlers;
};

export const getAuthHandlers = () => handlers;
